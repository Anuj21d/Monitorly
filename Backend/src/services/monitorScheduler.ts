import cron from "node-cron";
import pool from "../config/database.js";
import { checkMonitorHealth } from "./monitorHealthService.js";

type DueMonitor = {
  id: number;
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  frequency: number;
  timeout: number;
  expectedStatus: number;
  headers: Record<string, string> | null;
  queryParams: Record<string, string> | null;
  body: unknown;
};

let schedulerStarted = false;
let schedulerTickRunning = false;
const monitorsInFlight = new Set<number>();

async function findDuePublicMonitors(): Promise<DueMonitor[]> {
  const [rows] = await pool.execute(
    `SELECT
       id,
       url,
       method,
       frequency,
       timeout,
       expected_status AS expectedStatus,
       headers,
       query_params AS queryParams,
       request_body AS body
     FROM monitors
     WHERE target_mode = 'public'
       AND status <> 'paused'
       AND (
         last_checked IS NULL
         OR last_checked <= DATE_SUB(
           UTC_TIMESTAMP(),
           INTERVAL frequency SECOND
         )
       )
     ORDER BY last_checked ASC
     LIMIT 50`,
  );

  return rows as DueMonitor[];
}

async function runMonitorCheck(monitor: DueMonitor): Promise<void> {
  if (monitorsInFlight.has(monitor.id)) {
    return;
  }

  monitorsInFlight.add(monitor.id);

  try {
    const result = await checkMonitorHealth({
      url: monitor.url,
      method: monitor.method,
      timeout: monitor.timeout,
      expectedStatus: monitor.expectedStatus,
      ...(monitor.headers != null && {
        headers: monitor.headers,
      }),
      ...(monitor.queryParams != null && {
        queryParams: monitor.queryParams,
      }),
      ...(monitor.body != null && {
        body: monitor.body,
      }),
    });

    await pool.execute(
      `UPDATE monitors
       SET status = ?,
           response_time = ?,
           last_checked = UTC_TIMESTAMP(),
           uptime = (
             SELECT COALESCE(
               ROUND(
                 100.0 * SUM(status = 'healthy') / NULLIF(COUNT(*), 0),
                 2
               ),
               0
             )
             FROM monitor_checks
             WHERE monitor_id = ?
           ),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?
         AND target_mode = 'public'
         AND status <> 'paused'`,
      [result.status, result.responseTime, monitor.id, monitor.id],
    );

    await pool.execute(
      `INSERT INTO monitor_checks
        (monitor_id, status, response_time, actual_status, checked_at)
       VALUES (?, ?, ?, ?, UTC_TIMESTAMP())`,
      [monitor.id, result.status, result.responseTime, result.actualStatus],
    );

    console.log(
      `Monitor ${monitor.id}: ${result.status}, ${result.responseTime} ms`,
    );
  } catch (error) {
    console.error(`Monitor ${monitor.id} check failed:`, error);
  } finally {
    monitorsInFlight.delete(monitor.id);
  }
}

export function startMonitorScheduler(): void {
  if (schedulerStarted) {
    return;
  }

  schedulerStarted = true;

  cron.schedule("*/10 * * * * *", async () => {
    if (schedulerTickRunning) {
      return;
    }

    schedulerTickRunning = true;

    try {
      const monitors = await findDuePublicMonitors();

      await Promise.all(monitors.map((monitor) => runMonitorCheck(monitor)));
    } catch (error) {
      console.error("Monitor scheduler query failed:", error);
    } finally {
      schedulerTickRunning = false;
    }
  });

  console.log("Monitor scheduler started");
}

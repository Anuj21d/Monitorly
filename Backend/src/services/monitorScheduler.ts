import cron from "node-cron";
import pool from "../config/database.js";

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

export function startMonitorScheduler(): void {
  if (schedulerStarted) {
    return;
  }

  schedulerStarted = true;

  cron.schedule("*/10 * * * * *", async () => {
    try {
      const monitors = await findDuePublicMonitors();
      console.log(`Found ${monitors.length} public monitors due for checking`);
    } catch (error) {
      console.error("Monitor scheduler query failed:", error);
    }
  });

  console.log("Monitor scheduler started");
}


import axios from "axios";
import { performance } from "node:perf_hooks";

type MonitorHealthCheckInput = {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  timeout: number;
  expectedStatus: number;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  body?: unknown;
};

type MonitorHealthCheckResult = {
  status: "healthy" | "degraded" | "down";
  responseTime: number;
  actualStatus: number | null;
};

export async function checkMonitorHealth(
  monitor: MonitorHealthCheckInput
): Promise<MonitorHealthCheckResult> {
  const parsedUrl = new URL(monitor.url);

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported");
  }

  const startedAt = performance.now();

  try {
    const response = await axios.request({
      url: parsedUrl.toString(),
      method: monitor.method,
      timeout: monitor.timeout * 1000,
      ...(monitor.headers !== undefined && { headers: monitor.headers }),
      ...(monitor.queryParams !== undefined && { params: monitor.queryParams }),
      ...(monitor.body !== undefined && { data: monitor.body }),
      validateStatus: () => true,
      maxRedirects: 0,
    });

    const responseTime = Math.round(performance.now() - startedAt);

    return {
      status:
        response.status === monitor.expectedStatus
          ? "healthy"
          : "degraded",
      responseTime,
      actualStatus: response.status,
    };
  } catch {
    return {
      status: "down",
      responseTime: Math.round(performance.now() - startedAt),
      actualStatus: null,
    };
  }
}

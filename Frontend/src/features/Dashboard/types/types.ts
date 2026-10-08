export type MonitorStatus = "healthy" | "degraded" | "down" | "paused";

export type Monitor = {
  id: string;
  name: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  status: MonitorStatus;
  responseTime: number | null;
  uptime: number;
  frequency: number;
  lastChecked: string;
  timeout?: number;
};

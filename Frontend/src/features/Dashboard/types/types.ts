
export type MonitorStatus =
  | "healthy"
  | "degraded"
  | "down"
  | "paused";

export type MonitorMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

export type MonitorAuthType =
  | "none"
  | "bearer"
  | "apiKey"
  | "basic";

export type Monitor = {
  id: string;
  name: string;
  url: string;
  method: MonitorMethod;
  status: MonitorStatus;
  responseTime: number | null;
  uptime: number;
  frequency: number;
  lastChecked: string | null;
  timeout?: number;

  // Request configuration
  queryParams?: Record<string, string>;
  headers?: Record<string, string>;
  authType?: MonitorAuthType;
  authConfig?: {
    token?: string;
    apiKeyName?: string;
    apiKeyValue?: string;
    username?: string;
    password?: string;
    apiKeyLocation?: "header" | "query";
  };
  body?: string | null;

  // Expected response
  expectedStatus?: number;
};

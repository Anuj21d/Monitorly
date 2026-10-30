export type MonitorStatus = "healthy" | "degraded" | "down" | "paused";

export type MonitorMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type MonitorAuthType = "none" | "bearer" | "api_key" | "basic";

export type Monitor = {
  id: string;
  name: string;
  url: string;
  targetMode: "public" | "local";
  method: MonitorMethod;
  status: MonitorStatus;
  responseTime: number | null;
  uptime: number;
  frequency: number;
  lastChecked: string | null;
  timeout?: number;
  expiresAt?: string | null;

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

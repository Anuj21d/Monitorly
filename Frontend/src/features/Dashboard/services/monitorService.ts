import { apiClient } from "../../Auth/AuthContext";
import type { Monitor } from "../types/types";

type MonitorApiResponse = {
  monitors?: Record<string, unknown>[];
  monitor?: Record<string, unknown>;
  message?: string;
};

function normalizeMonitor(data: Record<string, unknown>): Monitor {
  return {
    id: String(data.id),
    name: String(data.name ?? ""),
    url: String(data.url ?? ""),
    method: data.method as Monitor["method"],
    status: data.status as Monitor["status"],
    responseTime: data.responseTime == null ? null : Number(data.responseTime),
    uptime: Number(data.uptime ?? 0),
    frequency: Number(data.frequency ?? 60),
    timeout: Number(data.timeout ?? 10),
    lastChecked: data.lastChecked == null ? null : String(data.lastChecked),
    headers: (data.headers ?? {}) as Record<string, string>,
    queryParams: (data.queryParams ?? {}) as Record<string, string>,
    authType: (data.authType ?? "none") as Monitor["authType"],
    targetMode: data.targetMode === "local" ? "local" : "public",
    body: data.body == null ? null : String(data.body),
    expectedStatus: Number(data.expectedStatus ?? 200),
    expiresAt:
      typeof data.expiresAt === "string" || data.expiresAt === null
        ? data.expiresAt
        : null,
  };
}

export async function getMonitors(): Promise<Monitor[]> {
  const response = await apiClient.get<MonitorApiResponse>("/api/monitors");

  return (response.data.monitors ?? []).map(normalizeMonitor);
}

export async function getMonitor(id: string): Promise<Monitor> {
  const response = await apiClient.get<MonitorApiResponse>(
    `/api/monitors/${id}`,
  );

  if (!response.data.monitor) {
    throw new Error("Monitor was not returned by the server");
  }

  return normalizeMonitor(response.data.monitor);
}

export async function createMonitor(monitor: Monitor): Promise<Monitor> {
  const response = await apiClient.post<MonitorApiResponse>("/api/monitors", {
    name: monitor.name,
    url: monitor.url,
    method: monitor.method,
    frequency: monitor.frequency,
    timeout: monitor.timeout ?? 10,
    headers: monitor.headers ?? {},
    queryParams: monitor.queryParams ?? {},
    authType: monitor.authType ?? "none",
    authConfig: monitor.authConfig ?? null,
    targetMode: monitor.targetMode ?? "public",
    expiresAt: monitor.expiresAt ?? null,
    body: monitor.body,
    expectedStatus: monitor.expectedStatus ?? 200,
  });

  if (!response.data.monitor) {
    throw new Error("Created monitor was not returned by the server");
  }

  return normalizeMonitor(response.data.monitor);
}

export async function updateMonitor(
  id: string,
  monitor: Partial<Monitor>,
): Promise<void> {
  await apiClient.put(`/api/monitors/${id}`, {
    name: monitor.name,
    url: monitor.url,
    method: monitor.method,
    frequency: monitor.frequency,
    timeout: monitor.timeout,
    headers: monitor.headers,
    queryParams: monitor.queryParams,
    body: monitor.body,
    expectedStatus: monitor.expectedStatus,
    targetMode: monitor.targetMode,
    expiresAt: monitor.expiresAt ?? null,
  });
}

export async function deleteMonitor(id: string): Promise<void> {
  await apiClient.delete(`/api/monitors/${id}`);
}

export async function pauseMonitor(id: string): Promise<void> {
  await apiClient.patch(`/api/monitors/${id}/pause`);
}

export async function resumeMonitor(id: string): Promise<void> {
  await apiClient.patch(`/api/monitors/${id}/resume`);
}

export type MonitorCheck = {
  id: number;
  status: "healthy" | "degraded" | "down";
  responseTime: number;
  actualStatus: number | null;
  checkedAt: string;
};

export async function getMonitorHistory(
  id: string,
  limit = 50,
): Promise<MonitorCheck[]> {
  const response = await apiClient.get<{ history: MonitorCheck[] }>(
    `/api/monitors/${id}/history`,
    {
      params: { limit },
    },
  );

  return response.data.history;
}

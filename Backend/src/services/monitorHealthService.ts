import axios from "axios";
import { decryptCredentials } from "./credentialEncryption.js";
import http from "node:http";
import https from "node:https";
import { performance } from "node:perf_hooks";
import { resolveMonitorUrl } from "../utils/urlSecurity.js";

type MonitorHealthCheckInput = {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  timeout: number;
  expectedStatus: number;
  authType: "none" | "api_key" | "bearer" | "basic";
  authConfig: string | null;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  body?: unknown;
};

type AuthConfig =
  | { apiKey: string; headerName: string }
  | { token: string }
  | { username: string; password: string };

type MonitorHealthCheckResult = {
  status: "healthy" | "degraded" | "down";
  responseTime: number;
  actualStatus: number | null;
};

function buildAuthHeaders(
  authType: MonitorHealthCheckInput["authType"],
  authConfig: string | null,
): Record<string, string> {
  if (authType === "none") {
    return {};
  }

  if (!authConfig) {
    throw new Error("Missing encrypted authentication configuration");
  }

  const credentials = decryptCredentials<AuthConfig>(authConfig);

  switch (authType) {
    case "api_key": {
      const config = credentials as Extract<AuthConfig, { apiKey: string }>;

      if (!config.apiKey || !config.headerName) {
        throw new Error("Invalid API key configuration");
      }

      return { [config.headerName]: config.apiKey };
    }

    case "bearer": {
      const config = credentials as Extract<AuthConfig, { token: string }>;

      if (!config.token) {
        throw new Error("Invalid bearer token configuration");
      }

      return { Authorization: `Bearer ${config.token}` };
    }

    case "basic": {
      const config = credentials as Extract<AuthConfig, { username: string }>;

      if (!config.username || !config.password) {
        throw new Error("Invalid Basic Auth configuration");
      }

      const encoded = Buffer.from(
        `${config.username}:${config.password}`,
        "utf8",
      ).toString("base64");

      return { Authorization: `Basic ${encoded}` };
    }

    default:
      throw new Error("Unsupported authentication type");
  }
}

export async function checkMonitorHealth(
  monitor: MonitorHealthCheckInput,
): Promise<MonitorHealthCheckResult> {
  // Resolve and validate before initiating any network request.
  const target = await resolveMonitorUrl(monitor.url);
  const { url, addresses } = target;

  const startedAt = performance.now();

  try {
    const agentOptions = {
      keepAlive: false,
      lookup: (_hostname: string, options: unknown, callback?: unknown) => {
        // Node can call lookup with or without options.
        const cb = typeof options === "function" ? options : callback;

        const lookupOptions =
          typeof options === "object" && options !== null
            ? (options as { all?: boolean })
            : {};

        if (typeof cb !== "function") {
          throw new Error("Invalid DNS lookup callback");
        }

        if (lookupOptions.all) {
          (cb as (err: null, results: typeof addresses) => void)(
            null,
            addresses,
          );
          return;
        }

        (cb as (err: null, address: string, family: number) => void)(
          null,
          addresses[0]!.address,
          addresses[0]!.family,
        );
      },
    };

    const authHeaders = buildAuthHeaders(monitor.authType, monitor.authConfig);

    const requestHeaders = {
      ...monitor.headers,
      ...authHeaders,
    };
    const response = await axios.request({
      url: url.toString(),
      method: monitor.method,
      timeout: monitor.timeout * 1000,
      headers: requestHeaders,
      ...(monitor.queryParams !== undefined
        ? { params: monitor.queryParams }
        : {}),
      ...(monitor.body !== undefined ? { data: monitor.body } : {}),
      httpAgent:
        url.protocol === "http:" ? new http.Agent(agentOptions) : undefined,
      httpsAgent:
        url.protocol === "https:" ? new https.Agent(agentOptions) : undefined,
      validateStatus: () => true,
      maxRedirects: 0,
    });

    return {
      status:
        response.status === monitor.expectedStatus ? "healthy" : "degraded",
      responseTime: Math.round(performance.now() - startedAt),
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

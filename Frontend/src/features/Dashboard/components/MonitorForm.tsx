import { X } from "lucide-react";
import { useState } from "react";
import type { Monitor } from "../types/types";

type MonitorFormProps = {
  monitor?: Monitor;
  onClose: () => void;
  onSubmit: (monitor: Monitor) => void;
};

const MonitorForm = ({ monitor, onClose, onSubmit }: MonitorFormProps) => {
  const isEditing = Boolean(monitor);

  const [serviceName, setServiceName] = useState(monitor?.name ?? "");

  const [endpointUrl, setEndpointUrl] = useState(monitor?.url ?? "");

  const [method, setMethod] = useState(monitor?.method ?? "GET");

  const [frequency, setFrequency] = useState(monitor?.frequency ?? 30);

  const [timeout, setTimeoutValue] = useState(monitor?.timeout ?? 10);

  const [authType, setAuthType] = useState<
    "none" | "bearer" | "apiKey" | "basic"
  >(monitor?.authType ?? "none");

  const [token, setToken] = useState(monitor?.authConfig?.token ?? "");

  const [apiKeyName, setApiKeyName] = useState(
    monitor?.authConfig?.apiKeyName ?? "X-API-Key",
  );

  const [apiKeyValue, setApiKeyValue] = useState(
    monitor?.authConfig?.apiKeyValue ?? "",
  );

  const [apiKeyLocation, setApiKeyLocation] = useState<"header" | "query">(
    monitor?.authConfig?.apiKeyLocation ?? "header",
  );

  const [username, setUsername] = useState(monitor?.authConfig?.username ?? "");

  const [password, setPassword] = useState(monitor?.authConfig?.password ?? "");

  const [headersText, setHeadersText] = useState(
    JSON.stringify(monitor?.headers ?? {}, null, 2),
  );

  const [queryParamsText, setQueryParamsText] = useState(
    JSON.stringify(monitor?.queryParams ?? {}, null, 2),
  );

  const [body, setBody] = useState(monitor?.body ?? "");

  const [expectedStatus, setExpectedStatus] = useState(
    monitor?.expectedStatus ?? 200,
  );

  const fieldClassName =
    "w-full rounded-xl border border-white/10 bg-[#090909] px-4 py-3 text-sm text-[#F5F3EE] outline-none transition placeholder:text-[#666666] focus:border-[#FF5A5F]/70 focus:ring-2 focus:ring-[#FF5A5F]/15";
  const labelClassName =
    "mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#999999]";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let headers: Record<string, string>;
    let queryParams: Record<string, string>;

    try {
      headers = JSON.parse(headersText);
      queryParams = JSON.parse(queryParamsText);

      if (
        !headers ||
        typeof headers !== "object" ||
        Array.isArray(headers) ||
        !Object.values(headers).every((value) => typeof value === "string")
      ) {
        throw new Error("Headers must be a JSON object with string values.");
      }

      if (
        !queryParams ||
        typeof queryParams !== "object" ||
        Array.isArray(queryParams) ||
        !Object.values(queryParams).every((value) => typeof value === "string")
      ) {
        throw new Error(
          "Query parameters must be a JSON object with string values.",
        );
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Enter valid JSON for headers and query parameters.",
      );
      return;
    }

    if (body.trim()) {
      try {
        JSON.parse(body);
      } catch {
        alert("Request body must contain valid JSON.");
        return;
      }
    }

    if (
      !Number.isInteger(expectedStatus) ||
      expectedStatus < 100 ||
      expectedStatus > 599
    ) {
      alert("Expected HTTP status must be between 100 and 599.");
      return;
    }

    if (!Number.isFinite(timeout) || timeout < 1 || timeout > 120) {
      alert("Timeout must be between 1 and 120 seconds.");
      return;
    }

    const authConfig =
      authType === "bearer"
        ? { token }
        : authType === "apiKey"
          ? { apiKeyName, apiKeyValue, apiKeyLocation }
          : authType === "basic"
            ? { username, password }
            : undefined;

    const updatedMonitor: Monitor = {
      id: monitor?.id ?? crypto.randomUUID(),
      name: serviceName.trim(),
      url: endpointUrl.trim(),
      method,
      frequency,
      timeout,
      status: monitor?.status ?? "healthy",
      responseTime: monitor?.responseTime ?? null,
      uptime: monitor?.uptime ?? 100,
      lastChecked: monitor?.lastChecked ?? "Never",
      queryParams,
      headers,
      authType,
      authConfig,
      body: body.trim() || undefined,
      expectedStatus,
    };

    onSubmit(updatedMonitor);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="monitor-form-title"
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#111111] text-[#F5F3EE] shadow-[0_24px_100px_rgba(0,0,0,0.65)]"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-white/[0.08] px-5 py-5 sm:px-8 sm:py-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF777B] font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A5F] shadow-[0_0_10px_rgba(255,90,95,0.8)]" />
              {isEditing ? "Edit Monitor" : "New Monitor"}
            </div>

            <h3
              id="monitor-form-title"
              className="font-display text-2xl font-bold tracking-tight sm:text-[28px]"
            >
              {isEditing ? "Edit Monitor" : "Add Monitor"}
            </h3>
            <p className="mt-1 text-sm text-[#888888]">
              Configure the endpoint and how it should be checked.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-[#999999] transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            aria-label="Close"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-bold text-[#FF777B]">
                  01
                </span>
                <h4 className="text-sm font-semibold text-[#E8E6E1]">
                  Endpoint
                </h4>
                <div className="h-px flex-1 bg-white/[0.07]" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Service Name */}
                <div>
                  <label htmlFor="service-name" className={labelClassName}>
                    Service Name
                  </label>

                  <input
                    id="service-name"
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className={fieldClassName}
                    placeholder="e.g. Payment API"
                    required
                  />
                </div>

                {/* Endpoint URL */}
                <div>
                  <label htmlFor="endpoint-url" className={labelClassName}>
                    Endpoint URL
                  </label>

                  <input
                    id="endpoint-url"
                    type="url"
                    value={endpointUrl}
                    onChange={(e) => setEndpointUrl(e.target.value)}
                    className={`${fieldClassName} font-mono text-[13px]`}
                    placeholder="https://api.example.com/health"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {/* HTTP Method */}
                <div>
                  <label htmlFor="http-method" className={labelClassName}>
                    HTTP Method
                  </label>

                  <select
                    id="http-method"
                    value={method}
                    onChange={(e) =>
                      setMethod(e.target.value as Monitor["method"])
                    }
                    className={fieldClassName}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>

                {/* Frequency */}
                <div>
                  <label htmlFor="frequency" className={labelClassName}>
                    Check Frequency
                  </label>

                  <select
                    id="frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(Number(e.target.value))}
                    className={fieldClassName}
                  >
                    <option value={30}>Every 30 seconds</option>
                    <option value={60}>Every 1 minute</option>
                    <option value={300}>Every 5 minutes</option>
                    <option value={600}>Every 10 minutes</option>
                  </select>
                </div>

                {/* Timeout */}
                <div>
                  <label htmlFor="timeout" className={labelClassName}>
                    Timeout
                  </label>

                  <div className="relative">
                    <input
                      id="timeout"
                      type="number"
                      min={1}
                      max={120}
                      value={timeout}
                      onChange={(e) => setTimeoutValue(Number(e.target.value))}
                      className={`${fieldClassName} pr-16`}
                      placeholder="10"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#666666] font-mono">
                      seconds
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Authentication */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-bold text-[#FF777B]">
                  02
                </span>
                <h4 className="text-sm font-semibold text-[#E8E6E1]">
                  Request settings
                </h4>
                <div className="h-px flex-1 bg-white/[0.07]" />
              </div>
              <div>
                <label className={labelClassName}>Authentication</label>

                <select
                  value={authType}
                  onChange={(e) =>
                    setAuthType(
                      e.target.value as "none" | "bearer" | "apiKey" | "basic",
                    )
                  }
                  className={fieldClassName}
                >
                  <option value="none">None</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="apiKey">API Key</option>
                  <option value="basic">Basic Authentication</option>
                </select>

                {authType === "bearer" && (
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Bearer token"
                    className={`${fieldClassName} mt-3`}
                  />
                )}

                {authType === "apiKey" && (
                  <div className="space-y-3 mt-3">
                    <input
                      value={apiKeyName}
                      onChange={(e) => setApiKeyName(e.target.value)}
                      placeholder="Key name, e.g. X-API-Key"
                      className={fieldClassName}
                    />

                    <input
                      type="password"
                      autoComplete="new-password"
                      value={apiKeyValue}
                      onChange={(e) => setApiKeyValue(e.target.value)}
                      placeholder="API key value"
                      className={fieldClassName}
                    />

                    <select
                      value={apiKeyLocation}
                      onChange={(e) =>
                        setApiKeyLocation(e.target.value as "header" | "query")
                      }
                      className={fieldClassName}
                    >
                      <option value="header">Send in header</option>
                      <option value="query">Send in query parameter</option>
                    </select>
                  </div>
                )}

                {authType === "basic" && (
                  <div className="space-y-3 mt-3">
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      placeholder="Username"
                      className={fieldClassName}
                    />

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      placeholder="Password"
                      className={fieldClassName}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Query Parameters */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-bold text-[#FF777B]">
                  03
                </span>
                <h4 className="text-sm font-semibold text-[#E8E6E1]">
                  Request details
                </h4>
                <div className="h-px flex-1 bg-white/[0.07]" />
              </div>
              <div>
                <label className={labelClassName}>
                  Query Parameters (JSON)
                </label>
                <textarea
                  value={queryParamsText}
                  onChange={(e) => setQueryParamsText(e.target.value)}
                  rows={3}
                  placeholder={'{\n  "page": "1"\n}'}
                  className={`${fieldClassName} resize-y font-mono text-[13px] leading-relaxed`}
                />
              </div>

              {/* Custom Headers */}
              <div>
                <label className={labelClassName}>Custom Headers (JSON)</label>
                <textarea
                  value={headersText}
                  onChange={(e) => setHeadersText(e.target.value)}
                  rows={3}
                  placeholder={'{\n  "Content-Type": "application/json"\n}'}
                  className={`${fieldClassName} resize-y font-mono text-[13px] leading-relaxed`}
                />
              </div>

              {/* Request Body */}
              {["POST", "PUT", "PATCH"].includes(method) && (
                <div>
                  <label className={labelClassName}>Request Body (JSON)</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={5}
                    placeholder={'{\n  "example": true\n}'}
                    className={`${fieldClassName} resize-y font-mono text-[13px] leading-relaxed`}
                  />
                </div>
              )}

              {/* Expected Status */}
              <div>
                <label className={labelClassName}>Expected HTTP Status</label>
                <input
                  type="number"
                  min={100}
                  max={599}
                  value={expectedStatus}
                  onChange={(e) => setExpectedStatus(Number(e.target.value))}
                  required
                  className={fieldClassName}
                />
              </div>
            </section>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/[0.08] bg-[#111111] px-5 py-4 sm:px-8">
            <p className="hidden text-xs text-[#777777] sm:block">
              Your monitor settings can be updated later.
            </p>
            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#999999] transition hover:bg-white/[0.06] hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF5A5F] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF5A5F]/15 transition hover:bg-[#ff4349] active:scale-[0.98]"
              >
                {isEditing ? "Save Changes" : "Create Monitor"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MonitorForm;

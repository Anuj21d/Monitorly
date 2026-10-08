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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedMonitor: Monitor = {
      id: monitor?.id ?? crypto.randomUUID(),

      name: serviceName.trim(),
      url: endpointUrl.trim(),

      method,
      frequency,
      timeout,

      // Keep existing monitoring information when editing.
      // These will eventually come from your backend.
      status: monitor?.status ?? "healthy",
      responseTime: monitor?.responseTime ?? null,
      uptime: monitor?.uptime ?? 100,
      lastChecked: monitor?.lastChecked ?? "Never",
    };

    onSubmit(updatedMonitor);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111111] text-[#F5F3EE] border border-white/[0.12] rounded-[24px] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-white/[0.1]">
          <div>
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#FF5A5F] mb-1 font-mono">
              {isEditing ? "Edit Monitor" : "New Monitor"}
            </div>

            <h3 className="text-2xl font-bold tracking-tight font-display">
              {isEditing ? "Edit Monitor" : "Add Monitor"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-white/[0.08] transition-colors"
            aria-label="Close"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-6">
          {/* Service Name */}
          <div>
            <label
              htmlFor="service-name"
              className="block text-xs font-bold tracking-wider uppercase text-[#888888] mb-1.5 font-mono"
            >
              Service Name
            </label>

            <input
              id="service-name"
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full bg-[#090909] border border-white/[0.12] focus:border-[#FF5A5F] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] placeholder-[#555555] focus:outline-none transition-colors"
              placeholder="e.g. Payment API"
              required
            />
          </div>

          {/* Endpoint URL */}
          <div>
            <label
              htmlFor="endpoint-url"
              className="block text-xs font-bold tracking-wider uppercase text-[#888888] mb-1.5 font-mono"
            >
              Endpoint URL
            </label>

            <input
              id="endpoint-url"
              type="url"
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              className="w-full bg-[#090909] border border-white/[0.12] focus:border-[#FF5A5F] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] placeholder-[#555555] font-mono focus:outline-none transition-colors"
              placeholder="https://api.example.com/health"
              required
            />
          </div>

          {/* HTTP Method */}
          <div>
            <label
              htmlFor="http-method"
              className="block text-xs font-bold tracking-wider uppercase text-[#888888] mb-1.5 font-mono"
            >
              HTTP Method
            </label>

            <select
              id="http-method"
              value={method}
              onChange={(e) => setMethod(e.target.value as Monitor["method"])}
              className="w-full bg-[#090909] border border-white/[0.12] focus:border-[#FF5A5F] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] focus:outline-none transition-colors"
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
            <label
              htmlFor="frequency"
              className="block text-xs font-bold tracking-wider uppercase text-[#888888] mb-1.5 font-mono"
            >
              Check Frequency
            </label>

            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full bg-[#090909] border border-white/[0.12] focus:border-[#FF5A5F] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] focus:outline-none transition-colors"
            >
              <option value={30}>Every 30 seconds</option>
              <option value={60}>Every 1 minute</option>
              <option value={300}>Every 5 minutes</option>
              <option value={600}>Every 10 minutes</option>
            </select>
          </div>

          {/* Timeout */}
          <div>
            <label
              htmlFor="timeout"
              className="block text-xs font-bold tracking-wider uppercase text-[#888888] mb-1.5 font-mono"
            >
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
                className="w-full bg-[#090909] border border-white/[0.12] focus:border-[#FF5A5F] rounded-xl px-4 py-3 pr-16 text-sm text-[#F5F3EE] placeholder-[#555555] focus:outline-none transition-colors"
                placeholder="10"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#666666] font-mono">
                seconds
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FF5A5F] text-white hover:bg-[#ff4349] transition-all disabled:opacity-50 shadow-md shadow-[#FF5A5F]/15"
            >
              {isEditing ? "Save Changes" : "Create Monitor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MonitorForm;

import { CirclePlus, X } from "lucide-react";
import { useState } from "react";
import type { Monitor } from "../types/types";

const DashboardHeader = () => {
  const [addMonitor, setAddMonitor] = useState(false);

  const [method, setMethod] = useState<Monitor["method"]>("GET");
  const [frequency, setFrequency] = useState(30);
  const [serviceName, setServiceName] = useState("");
  const [endpointUrl, setEndpointUrl] = useState("");

  const handleCreateMonitor = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newMonitor: Monitor = {
      id: crypto.randomUUID(),
      name: serviceName,
      url: endpointUrl,
      method: method,
      status: "healthy",
      responseTime: null,
      uptime: 100,
      frequency: frequency,
      lastChecked: "Never",
    };

    console.log(newMonitor);

    setServiceName("");
    setEndpointUrl("");
    setMethod("GET");
    setFrequency(30);
    setAddMonitor(false);
  };

  return (
    <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2 border-b border-white/6 mb-10">
      <div>
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#666666] mb-1.5 font-bold">
          Monitoring
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-[-0.03em] text-[#F5F3EE] font-display">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-text-light-secondary mt-1.5 font-normal">
          Monitor the health and performance of your services.
        </p>
      </div>
      <div>
        <button
          onClick={() => {
            addMonitor ? setAddMonitor(false) : setAddMonitor(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase bg-coral hover:bg-coral-hover text-white transition-all shadow-lg shadow-[#FF5A5F]/15 active:scale-[0.98]"
        >
          <CirclePlus size={16} strokeWidth={1.5} />
          <span>Add Monitor</span>
        </button>
      </div>
      {addMonitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111111] text-[#F5F3EE] border border-white/[0.12] rounded-[24px] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-start justify-between pb-6 border-b border-white/[0.1]">
              <div>
                <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#FF5A5F] mb-1 font-mono">
                  New Monitor
                </div>
                <h3 className="text-2xl font-bold tracking-tight font-display">
                  Add Monitor
                </h3>
              </div>
              <button
                onClick={() => {
                  setAddMonitor(false);
                }}
                className="p-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>
            <form
              action=""
              className="space-y-5 pt-6"
              onSubmit={handleCreateMonitor}
            >
              <div>
                <label
                  htmlFor=""
                  className="block text-xs font-bold tracking-wider uppercase text-[#888888] mb-1.5 font-mono"
                >
                  Service Name
                </label>
                <input
                  value={serviceName}
                  onChange={(e) => {
                    setServiceName(e.target.value);
                  }}
                  type="text"
                  className="w-full bg-[#090909] border border-white/[0.12] focus:border-[#FF5A5F] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] placeholder-[#555555] focus:outline-none transition-colors"
                  placeholder="e.g. Payment API"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-[#888888] mb-1.5 font-mono">
                  HTTP Method
                </label>

                <select
                  value={method}
                  onChange={(e) =>
                    setMethod(e.target.value as Monitor["method"])
                  }
                  className="w-full bg-[#090909] border border-white/[0.12] focus:border-[#FF5A5F] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] focus:outline-none"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor=""
                  className="block text-xs font-bold tracking-wider uppercase text-[#888888] mb-1.5 font-mono"
                >
                  Endpoint Url
                </label>
                <input
                  value={endpointUrl}
                  onChange={(e) => {
                    setEndpointUrl(e.target.value);
                  }}
                  type="url"
                  required
                  className="w-full bg-[#090909] border border-white/[0.12] focus:border-[#FF5A5F] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] placeholder-[#555555] font-mono focus:outline-none transition-colors"
                  placeholder="https://api.example.com/health"
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-[#888888] mb-1.5 font-mono">
                  Check Frequency
                </label>

                <select
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  className="w-full bg-[#090909] border border-white/[0.12] focus:border-[#FF5A5F] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] focus:outline-none"
                >
                  <option value={30}>Every 30 seconds</option>
                  <option value={60}>Every 1 minute</option>
                  <option value={300}>Every 5 minutes</option>
                  <option value={600}>Every 10 minutes</option>
                </select>
              </div>
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setAddMonitor(false);
                  }}
                  type="button"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FF5A5F] text-white hover:bg-[#ff4349] transition-all disabled:opacity-50 shadow-md shadow-[#FF5A5F]/15"
                >
                  Create Monitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardHeader;

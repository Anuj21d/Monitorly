import { CirclePlus } from "lucide-react";
import { useState } from "react";
import type { Monitor } from "../types/types";
import MonitorForm from "./MonitorForm";
import { createMonitor } from "../services/monitorService";

type DashboardHeaderProps = {
  onCreateMonitor: (monitor: Monitor) => void;
};

const DashboardHeader = ({ onCreateMonitor }: DashboardHeaderProps) => {
  const [addMonitor, setAddMonitor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateMonitor = async (newMonitor: Monitor) => {
    try {
      setIsSaving(true);
      setError(null);

      const savedMonitor = await createMonitor(newMonitor);

      onCreateMonitor(savedMonitor);
      setAddMonitor(false);
    } catch (err) {
      console.error("Failed to create monitor:", err);
      setError("Unable to create monitor. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2 border-b border-white/6 mb-10">
      <div>
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#666666] mb-1.5 font-bold">
          Monitoring
        </div>

        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-[-0.03em] text-[#F5F3EE]">
          Dashboard
        </h1>

        <p className="text-sm sm:text-base text-text-light-secondary mt-1.5 font-normal">
          Monitor the health and performance of your services.
        </p>
      </div>

      <div>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => {
            setError(null);
            setAddMonitor((isOpen) => !isOpen);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase bg-coral hover:bg-coral-hover text-white transition-all shadow-lg shadow-[#FF5A5F]/15 active:scale-[0.98] disabled:opacity-50"
        >
          <CirclePlus size={16} strokeWidth={1.5} />
          <span>{isSaving ? "Saving..." : "Add Monitor"}</span>
        </button>

        {error && (
          <p role="alert" className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>

      {addMonitor && (
        <MonitorForm
          onClose={() => {
            if (!isSaving) {
              setAddMonitor(false);
              setError(null);
            }
          }}
          onSubmit={handleCreateMonitor}
        />
      )}
    </section>
  );
};

export default DashboardHeader;

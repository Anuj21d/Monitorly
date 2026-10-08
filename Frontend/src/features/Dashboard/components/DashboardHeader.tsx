import { CirclePlus, X } from "lucide-react";
import { useState } from "react";
import type { Monitor } from "../types/types";
import MonitorForm from "./MonitorForm";

const DashboardHeader = () => {
  const [addMonitor, setAddMonitor] = useState(false);

  const handleCreateMonitor = (newMonitor: Monitor) => {
    console.log("New monitor:", newMonitor);

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
        <MonitorForm
          onClose={() => setAddMonitor(false)}
          onSubmit={handleCreateMonitor}
        />
      )}
    </section>
  );
};

export default DashboardHeader;

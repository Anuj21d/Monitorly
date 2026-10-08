import { useState } from "react";
import { mockMonitors } from "../data/mockMonitors";
import type { Monitor } from "../types/types";
import MonitorForm from "../components/MonitorForm";
import DeleteButton from "./DeleteButton"; // Make sure this accepts isOpen, monitorName, onClose, onConfirm props as defined previously

const ActionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-ellipsis-vertical w-4 h-4"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

type ActionDropdownProps = {
  isBottom: boolean;
  monitor: Monitor;
  onEdit: (monitor: Monitor) => void;
  onTogglePause: (id: string) => void;
  onDelete: (monitor: Monitor) => void; // Updated to pass the specific monitor
};

const ActionDropdown = ({
  isBottom,
  monitor,
  onEdit,
  onTogglePause,
  onDelete,
}: ActionDropdownProps) => (
  <div
    className={`absolute right-0 ${
      isBottom ? "bottom-full mb-1" : "top-full mt-1"
    } w-40 p-1.5 rounded-2xl bg-[#151515] border border-white/[0.12] shadow-2xl space-y-1 text-xs z-50 font-sans text-left opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all duration-200`}
  >
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#F5F3EE] hover:bg-white/[0.06] transition-colors"
    >
      <span>View Details</span>
    </button>

    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onEdit(monitor);
      }}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#F5F3EE] hover:bg-white/[0.06] transition-colors"
    >
      <span>Edit</span>
    </button>

    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onTogglePause(monitor.id);
      }}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#F5F3EE] hover:bg-white/[0.06] transition-colors"
    >
      <span>{monitor.status === "paused" ? "Resume" : "Pause"}</span>
    </button>

    <div className="border-t border-white/[0.08] my-1" />

    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onDelete(monitor); // Trigger the delete flow
      }}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#FF5A5F] hover:bg-[#FF5A5F]/10 transition-colors"
    >
      <span>Delete</span>
    </button>
  </div>
);

const DashboardList = () => {
  const [monitors, setMonitors] = useState<Monitor[]>(mockMonitors);
  const [editingMonitor, setEditingMonitor] = useState<Monitor | null>(null);
  const [monitorToDelete, setMonitorToDelete] = useState<Monitor | null>(null);

  const handleUpdateMonitor = (updatedMonitor: Monitor) => {
    setMonitors((currentMonitors) =>
      currentMonitors.map((monitor) =>
        monitor.id === updatedMonitor.id ? updatedMonitor : monitor,
      ),
    );
    setEditingMonitor(null);
  };

  const handleTogglePause = (id: string) => {
    setMonitors((currentMonitors) =>
      currentMonitors.map((monitor) =>
        monitor.id === id
          ? {
              ...monitor,
              status: monitor.status === "paused" ? "healthy" : "paused",
            }
          : monitor,
      ),
    );
  };

  const handleDeleteConfirm = () => {
    if (!monitorToDelete) return;

    // 1. Remove the monitor from local state
    // (In a real app, you'd also await your API call here)
    setMonitors((currentMonitors) =>
      currentMonitors.filter((m) => m.id !== monitorToDelete.id),
    );

    console.log("Deleted:", monitorToDelete.name);

    // 2. Close the modal when done
    setMonitorToDelete(null);
  };

  return (
    <>
      <section className="bg-card-dark rounded-[24px] p-6 lg:p-8 border border-white/[0.08] space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F5F3EE] font-display">
            Your Monitors
          </h2>
          <p className="text-xs sm:text-sm text-neutral mt-1 text-[#888888]">
            Current status of your monitored services.
          </p>
        </div>

        <div className="bg-[#111111] rounded-[24px] border border-white/[0.08] overflow-visible shadow-lg">
          {/* Desktop View */}
          <div className="hidden md:block overflow-visible">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#666666]">
                  <th className="py-4 pl-6">Service</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Response Time</th>
                  <th className="py-4 px-4 text-right">Uptime</th>
                  <th className="py-4 px-4 text-right">Last Check</th>
                  <th className="py-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {monitors.map((monitor, index) => {
                  const isBottom = index >= monitors.length - 3;
                  return (
                    <tr
                      key={monitor.id}
                      className="hover:bg-[#151515] transition-colors cursor-pointer group relative"
                    >
                      <td className="py-4 pl-6 font-medium">
                        <div className="text-sm font-bold text-[#F5F3EE] group-hover:text-white transition-colors">
                          {monitor.name}
                        </div>
                        <div className="text-[11px] font-mono text-[#666666] truncate max-w-sm mt-0.5">
                          {monitor.url}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <span
                            className={`w-2 h-2 rounded-full bg-[#10B981] ${monitor.status === "paused" ? "hidden" : "inline"}`}
                          />
                          <span
                            className={`${monitor.status === "paused" ? "text-text-dark-muted " : "text-healthy"} font-mono uppercase`}
                          >
                            {monitor.status}
                          </span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-semibold">
                        <span className="text-[#F5F3EE]">
                          {monitor.responseTime ?? "—"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-[#888888]">
                        {monitor.uptime}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-[#666666]">
                        {monitor.lastChecked}
                      </td>
                      <td className="py-4 pr-6 text-right relative">
                        <div className="relative inline-block group/action">
                          <button
                            type="button"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg text-[#888888] hover:text-[#F5F3EE] hover:bg-white/[0.08] transition-colors focus:outline-none"
                            title="Monitor Actions"
                          >
                            <ActionIcon />
                          </button>

                          {/* Passed the onDelete prop */}
                          <ActionDropdown
                            isBottom={isBottom}
                            monitor={monitor}
                            onEdit={setEditingMonitor}
                            onTogglePause={handleTogglePause}
                            onDelete={setMonitorToDelete}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-white/[0.06]">
            {monitors.map((monitor, index) => {
              const isBottom = index >= monitors.length - 3;
              return (
                <div
                  key={monitor.id}
                  className="p-5 space-y-3 cursor-pointer hover:bg-[#151515] transition-colors relative"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-[#F5F3EE]">
                        {monitor.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-xs">
                        <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                        <span className="text-[#10B981]">{monitor.status}</span>
                      </div>
                    </div>
                    <div className="relative group/action">
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg text-[#888888] hover:text-[#F5F3EE] hover:bg-white/[0.08] transition-colors focus:outline-none"
                        title="Monitor Actions"
                      >
                        <ActionIcon />
                      </button>

                      {/* Passed the onDelete prop here too */}
                      <ActionDropdown
                        isBottom={isBottom}
                        monitor={monitor}
                        onEdit={setEditingMonitor}
                        onTogglePause={handleTogglePause}
                        onDelete={setMonitorToDelete}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <div>
                      <span className="text-[#666666]">Response: </span>
                      <span className="font-semibold text-[#F5F3EE]">
                        {monitor.responseTime ?? "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#666666]">Uptime: </span>
                      <span className="text-[#888888]">{monitor.uptime}</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-[#666666]">
                    Last checked {monitor.lastChecked}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Edit Monitor Modal */}
      {editingMonitor && (
        <MonitorForm
          monitor={editingMonitor}
          onClose={() => setEditingMonitor(null)}
          onSubmit={handleUpdateMonitor}
        />
      )}

      {/* Delete Monitor Modal */}
      <DeleteButton
        isOpen={monitorToDelete !== null}
        monitorName={monitorToDelete?.name || ""}
        onClose={() => setMonitorToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default DashboardList;

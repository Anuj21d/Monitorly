
import type { Monitor } from "../types/types";

type DashboardStatsProps = {
  monitors: Monitor[];
};

const DashboardStats = ({ monitors }: DashboardStatsProps) => {
  const totalMonitors = monitors.length;
  const healthyMonitors = monitors.filter(
    (monitor) => monitor.status === "healthy"
  ).length;

  const issueMonitors = monitors.filter(
    (monitor) =>
      monitor.status === "degraded" || monitor.status === "down"
  ).length;

  const stats = [
    { label: "Total Monitors", value: totalMonitors, type: "total" },
    { label: "Healthy", value: healthyMonitors, type: "healthy" },
    { label: "Issues", value: issueMonitors, type: "issues" },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
      {stats.map((stat) => (
        <div
          key={stat.type}
          className="bg-[#111111] rounded-[24px] p-6 sm:p-7 border border-white/[0.08] flex flex-col justify-between hover:border-white/[0.15] transition-all"
        >
          <div className="flex justify-between items-center">
            <div
              className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
                stat.type === "issues" ? "text-coral" : "text-[#F5F3EE]"
              }`}
            >
              {stat.value}
            </div>

            {stat.type !== "total" && (
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  stat.type === "healthy" ? "bg-[#10B981]" : "bg-coral"
                }`}
              />
            )}
          </div>

          <div className="text-xs font-semibold text-[#999999] mt-3 uppercase tracking-wider font-mono">
            {stat.label}
          </div>
        </div>
      ))}
    </section>
  );
};

export default DashboardStats;

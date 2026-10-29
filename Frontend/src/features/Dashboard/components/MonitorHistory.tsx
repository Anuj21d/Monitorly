import { useEffect, useState } from "react";
import {
  getMonitorHistory,
  type MonitorCheck,
} from "../services/monitorService";

type MonitorHistoryProps = {
  monitorId: string;
};

const MonitorHistory = ({ monitorId }: MonitorHistoryProps) => {
  const [history, setHistory] = useState<MonitorCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      try {
        setError(null);
        const checks = await getMonitorHistory(monitorId, 50);

        if (!cancelled) {
          setHistory(checks);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load monitor history:", err);
          setError("Unable to load monitor history.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [monitorId]);

  return (
    <section className="mt-6 rounded-[24px] border border-white/[0.08] bg-[#111111] p-5 text-[#F5F3EE] shadow-lg sm:p-6">
      <h3 className="text-base font-bold sm:text-lg">Monitor History</h3>
      <p className="mt-1 text-sm text-[#888888]">
        Recent response times and health checks
      </p>

      {isLoading && (
        <p className="mt-4 text-sm text-[#888888]">Loading history...</p>
      )}

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {!isLoading && !error && history.length === 0 && (
        <p className="mt-4 text-sm text-[#888888]">No checks recorded yet.</p>
      )}

      {!isLoading && !error && history.length > 0 && (
        <>
          <div className="custom-scrollbar mt-5 max-h-[420px] overflow-auto rounded-xl border border-white/[0.06]">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="sticky top-0 z-10 bg-[#111111]">
                <tr className="border-b border-white/[0.08] text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-[#666666]">
                  <th className="py-3 pr-4">Time</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Response</th>
                  <th className="py-3">HTTP</th>
                </tr>
              </thead>
              <tbody>
                {history.map((check) => (
                  <tr key={check.id} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]">
                    <td className="whitespace-nowrap py-3.5 pr-4 font-mono text-xs text-[#AAAAAA]">
                      {new Date(check.checkedAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${check.status.toLowerCase() === "up" || check.status.toLowerCase() === "success" ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300" : "border-[#FF777B]/20 bg-[#FF777B]/[0.08] text-[#FF777B]"}`}>
                        {check.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-xs">{check.responseTime} ms</td>
                    <td className="py-3.5 font-mono text-xs text-[#AAAAAA]">{check.actualStatus ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};

export default MonitorHistory;

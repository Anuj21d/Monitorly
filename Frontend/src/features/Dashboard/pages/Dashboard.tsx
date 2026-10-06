import { CirclePlus } from "lucide-react";
import PageContainer from "../../../components/layout/PageContainer";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-canvas text-text-light-primary flex flex-col font-sans selection:bg-coral selection:text-white antialiased">
      <Navbar />
      <PageContainer className="py-10">
        <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2 border-b border-white/6 mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#666666] mb-1.5 font-bold">
              Overview
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-black tracking-[-0.03em] text-[#F5F3EE] font-display">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-text-light-secondary mt-1.5 font-normal">
              Monitor the health of your services.
            </p>
          </div>
          <div>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase bg-coral hover:bg-coral-hover text-white transition-all shadow-lg shadow-[#FF5A5F]/15 active:scale-[0.98]">
              <CirclePlus size={16} strokeWidth={1.5} />
              <span>Add Monitor</span>
            </button>
          </div>
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#111111] rounded-[24px] p-6 sm:p-7 border border-white/[0.08] flex flex-col justify-between hover:border-white/[0.15] transition-all">
            <div className="text-4xl sm:text-5xl font-black text-[#F5F3EE] font-mono tracking-tight">
              12
            </div>
            <div className="text-xs font-semibold text-[#999999] mt-3 uppercase tracking-wider font-mono">
              Total Monitors
            </div>
          </div>
          <div className="bg-[#111111] rounded-[24px] p-6 sm:p-7 border border-white/[0.08] flex flex-col justify-between hover:border-white/[0.15] transition-all">
            <div className="flex justify-between items-center">
              <div className="text-4xl sm:text-5xl font-black text-[#F5F3EE] font-mono tracking-tight">
                10
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
            </div>

            <div className="text-xs font-semibold text-[#999999] mt-3 uppercase tracking-wider font-mono">
              Healthy
            </div>
          </div>
          <div className="bg-[#111111] rounded-[24px] p-6 sm:p-7 border border-white/[0.08] flex flex-col justify-between hover:border-white/[0.15] transition-all">
            <div className="flex justify-between items-center">
              <div className="text-4xl sm:text-5xl font-black text-coral font-mono tracking-tight">
                2
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-coral"></div>
            </div>
            <div className="text-xs font-semibold text-[#999999] mt-3 uppercase tracking-wider font-mono">
              Issues
            </div>
          </div>
        </section>
        <section className="bg-card-dark rounded-[24px] p-6 lg:p-8 border border-white/[0.08] space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F5F3EE] font-display">
              Your Monitors
            </h2>
            <p className="text-xs sm:text-sm text-neutral mt-1">
              Current status of your monitored services.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-text-light-muted">
                  <th className="pb-3 pl-3">Sevices</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Response</th>
                  <th className="pb-3 text-right pr-3">Uptime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                <tr className="hover:bg-[#151515] transition-colors cursor-pointer group">
                  <td className="py-4 pl-3 font-medium">
                    <div className="text-sm font-bold text-[#F5F3EE] group-hover:text-white transition-colors">
                      Payment API
                    </div>
                    <div className="text-[11px] font-mono text-[#666666] truncate max-w-md mt-0.5">
                      https://api.monitorly.io/v1/payments/health
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                      <span className="capitalize text-[#10B981] font-mono">
                        Healty
                      </span>
                    </span>
                  </td>
                  <td className="py-4 text-right font-mono font-semibold">
                    <span className="text-[#F5F3EE]"> 142 ms</span>
                  </td>
                  <td className="py-4 text-right font-mono text-[#888888] pr-3">
                    99.99%
                  </td>
                </tr>
                <tr className="hover:bg-[#151515] transition-colors cursor-pointer group">
                  <td className="py-4 pl-3 font-medium">
                    <div className="text-sm font-bold text-[#F5F3EE] group-hover:text-white transition-colors">
                      Payment API
                    </div>
                    <div className="text-[11px] font-mono text-[#666666] truncate max-w-md mt-0.5">
                      https://api.monitorly.io/v1/payments/health
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                      <span className="capitalize text-[#10B981] font-mono">
                        Healty
                      </span>
                    </span>
                  </td>
                  <td className="py-4 text-right font-mono font-semibold">
                    <span className="text-[#F5F3EE]"> 142 ms</span>
                  </td>
                  <td className="py-4 text-right font-mono text-[#888888] pr-3">
                    99.99%
                  </td>
                </tr>
                <tr className="hover:bg-[#151515] transition-colors cursor-pointer group">
                  <td className="py-4 pl-3 font-medium">
                    <div className="text-sm font-bold text-[#F5F3EE] group-hover:text-white transition-colors">
                      Payment API
                    </div>
                    <div className="text-[11px] font-mono text-[#666666] truncate max-w-md mt-0.5">
                      https://api.monitorly.io/v1/payments/health
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                      <span className="capitalize text-[#10B981] font-mono">
                        Healty
                      </span>
                    </span>
                  </td>
                  <td className="py-4 text-right font-mono font-semibold">
                    <span className="text-[#F5F3EE]"> 142 ms</span>
                  </td>
                  <td className="py-4 text-right font-mono text-[#888888] pr-3">
                    99.99%
                  </td>
                </tr>
                <tr className="hover:bg-[#151515] transition-colors cursor-pointer group">
                  <td className="py-4 pl-3 font-medium">
                    <div className="text-sm font-bold text-[#F5F3EE] group-hover:text-white transition-colors">
                      Payment API
                    </div>
                    <div className="text-[11px] font-mono text-[#666666] truncate max-w-md mt-0.5">
                      https://api.monitorly.io/v1/payments/health
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                      <span className="capitalize text-[#10B981] font-mono">
                        Healty
                      </span>
                    </span>
                  </td>
                  <td className="py-4 text-right font-mono font-semibold">
                    <span className="text-[#F5F3EE]"> 142 ms</span>
                  </td>
                  <td className="py-4 text-right font-mono text-[#888888] pr-3">
                    99.99%
                  </td>
                </tr>
                <tr className="hover:bg-[#151515] transition-colors cursor-pointer group">
                  <td className="py-4 pl-3 font-medium">
                    <div className="text-sm font-bold text-[#F5F3EE] group-hover:text-white transition-colors">
                      Payment API
                    </div>
                    <div className="text-[11px] font-mono text-[#666666] truncate max-w-md mt-0.5">
                      https://api.monitorly.io/v1/payments/health
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                      <span className="capitalize text-[#10B981] font-mono">
                        Healty
                      </span>
                    </span>
                  </td>
                  <td className="py-4 text-right font-mono font-semibold">
                    <span className="text-[#F5F3EE]"> 142 ms</span>
                  </td>
                  <td className="py-4 text-right font-mono text-[#888888] pr-3">
                    99.99%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </PageContainer>
    </div>
  );
};

export default Dashboard;

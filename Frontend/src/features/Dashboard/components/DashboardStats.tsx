const DashboardStats = () => {
  return (
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
  );
};

export default DashboardStats;

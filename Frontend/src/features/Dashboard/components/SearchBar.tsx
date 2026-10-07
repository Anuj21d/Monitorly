import { Search } from "lucide-react";
import React, { useState } from "react";

const SearchBar = () => {
  // Track which filter is currently active
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Healthy", "Degraded", "Down", "Paused"];

  return (
    <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#090909] border border-white/5 mb-10">
      {/* Search Input Area */}
      <div className="relative flex-1 max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]"
          size={16}
          strokeWidth={1.5}
        />
        <input
          type="text"
          className="w-full bg-[#050505] text-xs text-[#F5F3EE] placeholder-[#666666] pl-9 pr-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-white/[0.2] font-mono transition-colors"
          placeholder="Search monitors..."
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center p-1 bg-[#050505] border border-white/[0.08] rounded-xl text-xs font-medium">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === filter
                  ? "bg-[#151515] text-[#F5F3EE] font-bold border border-white/[0.1] shadow-sm"
                  : "text-[#888888] hover:text-[#F5F3EE] border border-transparent hover:bg-white/[0.02]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchBar;

import React, { useState, useMemo } from 'react';
import type { ResponseHeaderItem } from '../types/apiTester.types';
import { Search, Copy, Check } from 'lucide-react';

interface ResponseHeadersProps {
  headers: ResponseHeaderItem[];
}

export const ResponseHeaders: React.FC<ResponseHeadersProps> = ({ headers }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredHeaders = useMemo(() => {
    if (!filterQuery.trim()) return headers;
    const q = filterQuery.toLowerCase();
    return headers.filter(
      (h) => h.key.toLowerCase().includes(q) || h.value.toLowerCase().includes(q)
    );
  }, [headers, filterQuery]);

  const handleCopyRow = (header: ResponseHeaderItem) => {
    navigator.clipboard.writeText(`${header.key}: ${header.value}`);
    setCopiedKey(header.key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-3 font-sans">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#666666]" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter headers..."
            className="w-full bg-[#0d0d0d] border border-white/[0.08] focus:border-[#FF5A5F] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#F5F3EE] font-mono placeholder-[#555555] outline-none"
          />
        </div>
        <span className="text-[11px] font-mono text-[#777777]">
          Showing {filteredHeaders.length} of {headers.length} headers
        </span>
      </div>

      {/* Table */}
      <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-[#0d0d0d]">
        <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-[#141414] border-b border-white/[0.08] text-[11px] font-mono tracking-wider uppercase text-[#888888]">
          <div className="col-span-4">Header Key</div>
          <div className="col-span-7">Value</div>
          <div className="col-span-1 text-right">Copy</div>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {filteredHeaders.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#666666] font-mono">
              No headers matching "{filterQuery}"
            </div>
          ) : (
            filteredHeaders.map((header) => (
              <div
                key={header.key}
                className="grid grid-cols-12 gap-2 px-3 py-2 items-center hover:bg-white/[0.02] text-xs font-mono transition-colors"
              >
                <div className="col-span-4 font-semibold text-[#CCCCCC] truncate">
                  {header.key}
                </div>
                <div className="col-span-7 text-[#888888] truncate select-all">
                  {header.value}
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleCopyRow(header)}
                    className="p-1 rounded text-[#666666] hover:text-[#F5F3EE] transition-colors"
                    title="Copy header line"
                  >
                    {copiedKey === header.key ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

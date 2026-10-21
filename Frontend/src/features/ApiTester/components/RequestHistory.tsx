import React from 'react';
import type { ApiRequestConfig, RequestHistoryItem } from '../types/apiTester.types';
import { formatDuration, formatTimestamp } from '../utils/formatResponse';
import { History, Trash2, ArrowUpRight, Clock } from 'lucide-react';

interface RequestHistoryProps {
  history: RequestHistoryItem[];
  onSelectHistoryItem: (config: ApiRequestConfig) => void;
  onClearHistory: () => void;
}

export const RequestHistory: React.FC<RequestHistoryProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  return (
    <div className="flex flex-col h-full font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#FF5A5F]" />
          <span className="text-xs font-semibold text-[#F5F3EE]">Recent History</span>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#888888] hover:text-[#FF5A5F] transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pt-3">
        {history.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Clock className="w-6 h-6 text-[#555555] mx-auto" />
            <div className="text-xs text-[#888888]">No request history</div>
            <div className="text-[11px] text-[#555555]">
              Dispatched API calls will appear here for one-click restore.
            </div>
          </div>
        ) : (
          history.map((item) => {
            const methodColors: Record<string, string> = {
              GET: 'text-emerald-400 bg-emerald-500/10',
              POST: 'text-amber-400 bg-amber-500/10',
              PUT: 'text-blue-400 bg-blue-500/10',
              PATCH: 'text-purple-400 bg-purple-500/10',
              DELETE: 'text-[#FF5A5F] bg-[#FF5A5F]/10',
              HEAD: 'text-teal-400 bg-teal-500/10',
              OPTIONS: 'text-slate-400 bg-slate-500/10',
            };

            const isSuccess = item.status >= 200 && item.status < 300;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectHistoryItem(item.requestConfig)}
                className="w-full text-left p-2.5 rounded-xl bg-[#111111]/70 hover:bg-[#161616] border border-white/[0.06] hover:border-white/15 transition-all group flex flex-col gap-1.5 focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        methodColors[item.method] || 'text-white'
                      }`}
                    >
                      {item.method}
                    </span>
                    <span className="text-xs font-medium text-[#F5F3EE] truncate max-w-[130px]">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono ${
                        isSuccess ? 'text-emerald-400' : 'text-[#FF5A5F]'
                      }`}
                    >
                      {item.status}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-[#666666] group-hover:text-[#FF5A5F] transition-colors" />
                  </div>
                </div>

                <div className="text-[11px] font-mono text-[#777777] truncate">
                  {item.url}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#555555]">
                  <span>{formatTimestamp(item.timestamp)}</span>
                  <span>{formatDuration(item.durationMs)}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

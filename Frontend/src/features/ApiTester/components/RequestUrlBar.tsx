import React, { useState, useMemo } from 'react';
import type { HttpMethod } from '../types/apiTester.types';
import { validateUrl } from '../utils/queryParams';
import { Send, Loader2, Bookmark, Copy, RotateCcw, ChevronDown, Check, AlertCircle } from 'lucide-react';

interface RequestUrlBarProps {
  method: HttpMethod;
  onMethodChange: (method: HttpMethod) => void;
  url: string;
  onUrlChange: (url: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onSave: () => void;
  onDuplicate: () => void;
  onReset: () => void;
}

const HTTP_METHODS: { method: HttpMethod; color: string; bg: string; border: string }[] = [
  { method: 'GET', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { method: 'POST', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { method: 'PUT', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { method: 'PATCH', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { method: 'DELETE', color: 'text-[#FF5A5F]', bg: 'bg-[#FF5A5F]/10', border: 'border-[#FF5A5F]/30' },
  { method: 'HEAD', color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
  { method: 'OPTIONS', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
];

export const RequestUrlBar: React.FC<RequestUrlBarProps> = ({
  method,
  onMethodChange,
  url,
  onUrlChange,
  onSend,
  isLoading,
  onSave,
  onDuplicate,
  onReset,
}) => {
  const [isMethodOpen, setIsMethodOpen] = useState(false);

  // URL validation
  const validation = useMemo(() => validateUrl(url), [url]);

  const currentMethodConfig = HTTP_METHODS.find((m) => m.method === method) || HTTP_METHODS[0];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (validation.isValid && !isLoading) {
        onSend();
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 font-sans">
      <div className="flex items-center gap-2">
        {/* URL Input Bar Compound Control */}
        <div className="flex-1 flex items-center bg-[#111111] border border-white/[0.12] hover:border-white/20 focus-within:border-[#FF5A5F] focus-within:ring-2 focus-within:ring-[#FF5A5F]/20 rounded-xl transition-all shadow-sm">
          {/* Method Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMethodOpen(!isMethodOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 font-mono text-xs font-bold rounded-l-xl hover:bg-white/[0.04] transition-colors focus:outline-none ${currentMethodConfig.color}`}
              aria-label="Select HTTP Method"
            >
              <span>{method}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {isMethodOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMethodOpen(false)} />
                <div className="absolute left-0 top-full mt-1.5 w-36 rounded-xl bg-[#151515] border border-white/[0.12] shadow-2xl p-1 z-50 animate-fadeIn">
                  {HTTP_METHODS.map((item) => (
                    <button
                      key={item.method}
                      type="button"
                      onClick={() => {
                        onMethodChange(item.method);
                        setIsMethodOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-mono font-bold hover:bg-white/[0.06] transition-colors ${item.color}`}
                    >
                      <span>{item.method}</span>
                      {method === item.method && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="w-[1px] h-6 bg-white/[0.08]" />

          {/* URL Input Field */}
          <input
            type="text"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter request URL (e.g. https://api.monitorly.io/v1/payments/health)"
            className="flex-1 bg-transparent px-3.5 py-2.5 text-xs text-[#F5F3EE] font-mono placeholder-[#555555] outline-none"
            spellCheck={false}
          />

          {/* Inline Validation Warning if Invalid */}
          {!validation.isValid && (
            <div
              className="mr-2 px-2 py-0.5 rounded text-[10px] font-mono bg-[#FF5A5F]/10 text-[#FF5A5F] flex items-center gap-1"
              title={validation.error}
            >
              <AlertCircle className="w-3 h-3" />
              <span className="hidden sm:inline">Invalid URL</span>
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={onSend}
          disabled={isLoading || !validation.isValid}
          className="h-10 px-5 rounded-xl bg-[#FF5A5F] hover:bg-[#FF4349] disabled:opacity-40 disabled:hover:bg-[#FF5A5F] text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#FF5A5F]/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/40"
          title="Send Request (Simulated Preview)"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </>
          )}
        </button>

        {/* Secondary Action Buttons */}
        <div className="hidden sm:flex items-center gap-1.5">
          {/* Save Button */}
          <button
            type="button"
            onClick={onSave}
            className="h-10 px-3 rounded-xl bg-[#111111] hover:bg-[#181818] border border-white/[0.1] text-[#CCCCCC] hover:text-[#F5F3EE] text-xs font-medium flex items-center gap-1.5 transition-all focus:outline-none"
            title="Save Request to Collection"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#FF5A5F]" />
            <span>Save</span>
          </button>

          {/* Duplicate Button */}
          <button
            type="button"
            onClick={onDuplicate}
            className="h-10 w-10 rounded-xl bg-[#111111] hover:bg-[#181818] border border-white/[0.1] text-[#999999] hover:text-[#F5F3EE] flex items-center justify-center transition-all focus:outline-none"
            title="Duplicate Request"
            aria-label="Duplicate Request"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={onReset}
            className="h-10 w-10 rounded-xl bg-[#111111] hover:bg-[#181818] border border-white/[0.1] text-[#999999] hover:text-[#FF5A5F] flex items-center justify-center transition-all focus:outline-none"
            title="Reset Request to Defaults"
            aria-label="Reset Request"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

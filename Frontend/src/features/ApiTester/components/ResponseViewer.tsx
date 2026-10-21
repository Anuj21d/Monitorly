import React, { useState, useMemo } from 'react';
import type {
  ApiResponseData,
  ResponseBodyViewMode,
  ResponseTabKey,
} from '../types/apiTester.types';
import { ResponseHeaders } from './ResponseHeaders';
import { formatBytes, formatDuration } from '../utils/formatResponse';
import {
  Copy,
  Check,
  Search,
  Sparkles,
  Cookie,
  FileText,
  ShieldCheck,
  Terminal,
  Clock,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
} from 'lucide-react';

interface ResponseViewerProps {
  response: ApiResponseData | null;
  isLoading: boolean;
  activeTab: ResponseTabKey;
  onTabChange: (tab: ResponseTabKey) => void;
  viewMode: ResponseBodyViewMode;
  onViewModeChange: (mode: ResponseBodyViewMode) => void;
  onTriggerSend: () => void;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({
  response,
  isLoading,
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  onTriggerSend,
}) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopyBody = () => {
    if (!response?.body) return;
    navigator.clipboard.writeText(response.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Status Color Logic
  const statusBadge = useMemo(() => {
    if (!response) return null;
    const { status } = response;
    if (status >= 200 && status < 300) {
      return {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        dot: 'bg-emerald-400',
      };
    }
    if (status >= 300 && status < 400) {
      return {
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        text: 'text-cyan-400',
        dot: 'bg-cyan-400',
      };
    }
    if (status >= 400 && status < 500) {
      return {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        dot: 'bg-amber-400',
      };
    }
    return {
      bg: 'bg-[#FF5A5F]/10',
      border: 'border-[#FF5A5F]/30',
      text: 'text-[#FF5A5F]',
      dot: 'bg-[#FF5A5F]',
    };
  }, [response]);

  // Highlighted / Filtered body lines
  const bodyLines = useMemo(() => {
    if (!response?.body) return [];
    return response.body.split('\n');
  }, [response?.body]);

  return (
    <div className="flex flex-col bg-[#111111] rounded-2xl border border-white/[0.08] overflow-hidden font-sans min-h-[360px]">
      {/* 1. Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#0d0d0d] border-b border-white/[0.08]">
        {/* Left: Response Tabs */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onTabChange('body')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'body'
                ? 'bg-[#1e1e1e] text-[#F5F3EE] border border-white/[0.1]'
                : 'text-[#888888] hover:text-[#CCCCCC]'
            }`}
          >
            Body
          </button>

          <button
            type="button"
            onClick={() => onTabChange('headers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'headers'
                ? 'bg-[#1e1e1e] text-[#F5F3EE] border border-white/[0.1]'
                : 'text-[#888888] hover:text-[#CCCCCC]'
            }`}
          >
            <span>Headers</span>
            {response && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-mono text-[#CCCCCC]">
                {response.headers.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('cookies')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'cookies'
                ? 'bg-[#1e1e1e] text-[#F5F3EE] border border-white/[0.1]'
                : 'text-[#888888] hover:text-[#CCCCCC]'
            }`}
          >
            <Cookie className="w-3 h-3" />
            <span>Cookies</span>
            {response && response.cookies.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-mono text-[#CCCCCC]">
                {response.cookies.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('tests')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'tests'
                ? 'bg-[#1e1e1e] text-[#F5F3EE] border border-white/[0.1]'
                : 'text-[#888888] hover:text-[#CCCCCC]'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Tests</span>
            {response && response.testResults.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-[10px] font-mono text-emerald-400">
                {response.testResults.filter((t) => t.status === 'passed').length}/
                {response.testResults.length}
              </span>
            )}
          </button>
        </div>

        {/* Right: Telemetry (Status, Duration, Size, Preview Badge) */}
        {response && !isLoading && (
          <div className="flex items-center gap-3 text-xs font-mono">
            {/* Status Badge */}
            {statusBadge && (
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold ${statusBadge.bg} ${statusBadge.border} ${statusBadge.text}`}
              >
                <div className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
                <span>
                  {response.status} {response.statusText}
                </span>
              </div>
            )}

            {/* Time */}
            <div className="flex items-center gap-1 text-[#CCCCCC] bg-[#161616] px-2.5 py-1 rounded-lg border border-white/[0.06]">
              <Clock className="w-3 h-3 text-[#888888]" />
              <span>{formatDuration(response.durationMs)}</span>
            </div>

            {/* Size */}
            <div className="flex items-center gap-1 text-[#CCCCCC] bg-[#161616] px-2.5 py-1 rounded-lg border border-white/[0.06]">
              <Layers className="w-3 h-3 text-[#888888]" />
              <span>{formatBytes(response.sizeBytes)}</span>
            </div>

            {/* Sandbox Tag */}
            <div className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] text-[10px]">
              <Sparkles className="w-3 h-3" />
              <span>Local Sandbox Preview</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Loading State */}
      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
          <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-[#FF5A5F] animate-spin" />
          <div className="text-center space-y-1">
            <div className="text-sm font-semibold text-[#F5F3EE]">Dispatching Simulated Request</div>
            <div className="text-xs text-[#888888] font-mono">
              Simulating DNS resolution, handshake, and telemetry...
            </div>
          </div>
        </div>
      )}

      {/* 3. Empty State (No Request Sent) */}
      {!isLoading && !response && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#151515] border border-white/[0.08] flex items-center justify-center text-[#FF5A5F]">
            <Terminal className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <div className="text-sm font-semibold text-[#F5F3EE]">No Response Yet</div>
            <p className="text-xs text-[#888888]">
              Configure your endpoint, query parameters, or authorization above, then click{' '}
              <strong className="text-[#F5F3EE]">Send</strong> to view simulated telemetry and formatted payloads.
            </p>
          </div>
          <button
            type="button"
            onClick={onTriggerSend}
            className="mt-2 px-4 py-2 rounded-xl bg-[#1e1e1e] hover:bg-[#252525] border border-white/[0.1] text-xs font-semibold text-[#F5F3EE] transition-all"
          >
            Execute Send (Simulation)
          </button>
        </div>
      )}

      {/* 4. Active Response Content */}
      {!isLoading && response && (
        <div className="flex-1 flex flex-col p-4">
          {/* TAB: BODY */}
          {activeTab === 'body' && (
            <div className="flex-1 flex flex-col space-y-3">
              {/* Body sub-bar: View Modes & Search & Copy */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
                {/* View Modes */}
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#0d0d0d] border border-white/[0.06] text-[11px] font-mono">
                  {(['pretty', 'raw', 'preview'] as ResponseBodyViewMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => onViewModeChange(mode)}
                      className={`px-2.5 py-1 rounded capitalize transition-all ${
                        viewMode === mode
                          ? 'bg-[#1e1e1e] text-[#F5F3EE] font-semibold'
                          : 'text-[#888888] hover:text-[#CCCCCC]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {/* Search & Copy */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3 h-3 absolute left-2 top-2 text-[#666666]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search response..."
                      className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#FF5A5F] rounded-lg pl-7 pr-2.5 py-1 text-[11px] font-mono text-[#F5F3EE] placeholder-[#555555] outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyBody}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#181818] hover:bg-[#222222] border border-white/[0.08] text-[11px] font-mono text-[#CCCCCC] hover:text-white transition-all"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy Response'}</span>
                  </button>
                </div>
              </div>

              {/* Body Views */}
              {viewMode === 'pretty' && (
                <div className="flex-1 border border-white/[0.08] rounded-xl overflow-hidden bg-[#0a0a0a] flex font-mono text-xs min-h-[240px]">
                  {/* Line Numbers */}
                  <div className="w-10 select-none py-3 text-right pr-2 text-[#444444] bg-[#0c0c0c] border-r border-white/[0.06] text-[11px] leading-relaxed">
                    {bodyLines.map((_, i) => (
                      <div key={i + 1}>{i + 1}</div>
                    ))}
                  </div>
                  {/* Code block */}
                  <pre className="flex-1 p-3 overflow-x-auto text-[#E6E6E6] text-xs leading-relaxed font-mono whitespace-pre selection:bg-[#FF5A5F]/30">
                    {response.body}
                  </pre>
                </div>
              )}

              {viewMode === 'raw' && (
                <textarea
                  readOnly
                  value={response.body}
                  className="w-full flex-1 min-h-[240px] p-3 rounded-xl bg-[#0a0a0a] border border-white/[0.08] text-xs font-mono text-[#CCCCCC] leading-relaxed resize-y outline-none"
                />
              )}

              {viewMode === 'preview' && (
                <div className="flex-1 p-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08] space-y-3 text-xs">
                  <div className="text-[11px] font-mono text-[#888888] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#FF5A5F]" />
                    <span>Structured JSON Object Inspector:</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141414] border border-white/[0.06] overflow-x-auto">
                    {(() => {
                      try {
                        const parsed = JSON.parse(response.body);
                        return (
                          <div className="space-y-2 font-mono text-xs">
                            {Object.entries(parsed).map(([key, val]) => (
                              <div key={key} className="flex items-start gap-2 border-b border-white/[0.04] pb-1.5">
                                <span className="text-[#FF5A5F] font-semibold">{key}:</span>
                                <span className="text-[#E0E0E0] truncate">
                                  {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      } catch {
                        return <div className="text-[#888888]">Non-JSON preview format.</div>;
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: HEADERS */}
          {activeTab === 'headers' && <ResponseHeaders headers={response.headers} />}

          {/* TAB: COOKIES */}
          {activeTab === 'cookies' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#141414] border border-white/[0.08] text-xs text-[#AAAAAA]">
                <Info className="w-4 h-4 text-[#FF5A5F] shrink-0" />
                <span>
                  Cookies with the <code className="text-[#F5F3EE] font-mono">HttpOnly</code> flag cannot be read by JavaScript directly due to browser security policies.
                </span>
              </div>

              {response.cookies.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#666666] font-mono">
                  No response cookies returned by this endpoint.
                </div>
              ) : (
                <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-[#0d0d0d]">
                  <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-[#141414] border-b border-white/[0.08] text-[11px] font-mono tracking-wider uppercase text-[#888888]">
                    <div className="col-span-3">Cookie Name</div>
                    <div className="col-span-4">Value</div>
                    <div className="col-span-3">Domain & Path</div>
                    <div className="col-span-2 text-right">Flags</div>
                  </div>
                  <div className="divide-y divide-white/[0.04]">
                    {response.cookies.map((c) => (
                      <div key={c.name} className="grid grid-cols-12 gap-2 px-3 py-2 items-center text-xs font-mono">
                        <div className="col-span-3 font-semibold text-[#CCCCCC]">{c.name}</div>
                        <div className="col-span-4 text-[#888888] truncate">{c.value}</div>
                        <div className="col-span-3 text-[#777777] text-[11px]">
                          {c.domain} ({c.path})
                        </div>
                        <div className="col-span-2 flex justify-end gap-1">
                          {c.httpOnly && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px]">
                              HttpOnly
                            </span>
                          )}
                          {c.secure && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">
                              Secure
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: TESTS */}
          {activeTab === 'tests' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#888888]">
                  Test suite execution summary ({response.testResults.filter((t) => t.status === 'passed').length}/
                  {response.testResults.length} passed)
                </span>
              </div>

              <div className="border border-white/[0.08] rounded-xl overflow-hidden divide-y divide-white/[0.04] bg-[#0d0d0d]">
                {response.testResults.map((test, idx) => (
                  <div key={idx} className="flex items-center justify-between px-3.5 py-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      {test.status === 'passed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#FF5A5F] shrink-0" />
                      )}
                      <span className="text-[#F5F3EE] font-mono text-xs">{test.name}</span>
                    </div>

                    {test.message && (
                      <span className="text-[11px] font-mono text-[#888888]">{test.message}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

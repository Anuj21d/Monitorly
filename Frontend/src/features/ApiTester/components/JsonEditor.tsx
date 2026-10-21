import React, { useMemo } from 'react';
import { formatJsonString, validateJson } from '../utils/formatResponse';
import { Sparkles, Trash2, AlertCircle, CheckCircle2, Copy, Check } from 'lucide-react';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  placeholder = '{\n  "key": "value"\n}',
  height = 'min-h-[220px]',
}) => {
  const [copied, setCopied] = React.useState(false);

  // Validation
  const validation = useMemo(() => validateJson(value), [value]);

  // Line count and character count
  const stats = useMemo(() => {
    const lines = value ? value.split('\n').length : 1;
    const chars = value.length;
    return { lines, chars };
  }, [value]);

  const handleFormat = () => {
    const { formatted, isValid } = formatJsonString(value);
    if (isValid && formatted) {
      onChange(formatted);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col border border-white/[0.08] rounded-xl overflow-hidden bg-[#0d0d0d] font-sans">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#141414] border-b border-white/[0.08] text-xs">
        {/* Left: Validation indicator */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-[#888888] uppercase tracking-wider">JSON Body</span>
          {value.trim() ? (
            validation.isValid ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
                <CheckCircle2 className="w-3 h-3" /> Valid JSON
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] text-[11px] font-mono">
                <AlertCircle className="w-3 h-3" /> Invalid JSON
              </span>
            )
          ) : (
            <span className="text-[11px] font-mono text-[#555555]">Empty payload</span>
          )}
        </div>

        {/* Right: Actions (Format, Copy, Clear, Stats) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFormat}
            disabled={!validation.isValid || !value.trim()}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono text-[#F5F3EE] bg-[#1e1e1e] hover:bg-[#252525] disabled:opacity-40 disabled:cursor-not-allowed border border-white/[0.08] transition-all"
            title="Prettify JSON with 2-space indentation"
          >
            <Sparkles className="w-3 h-3 text-[#FF5A5F]" />
            <span>Format</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!value.trim()}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-mono text-[#999999] hover:text-[#F5F3EE] hover:bg-white/[0.05] disabled:opacity-40 transition-all"
            title="Copy JSON text"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={!value.trim()}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-mono text-[#999999] hover:text-[#FF5A5F] hover:bg-white/[0.05] disabled:opacity-40 transition-all"
            title="Clear JSON content"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>

          <div className="h-3 w-[1px] bg-white/10 mx-1" />

          <span className="text-[10px] font-mono text-[#666666]">
            {stats.lines}L · {stats.chars}C
          </span>
        </div>
      </div>

      {/* Error Callout if invalid */}
      {!validation.isValid && validation.error && (
        <div className="px-3 py-1.5 bg-[#FF5A5F]/10 border-b border-[#FF5A5F]/20 text-[11px] font-mono text-[#FF5A5F] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{validation.error}</span>
        </div>
      )}

      {/* Editor Body with Line Numbers */}
      <div className={`relative flex font-mono text-xs ${height} bg-[#0a0a0a]`}>
        {/* Line Numbers Gutter */}
        <div className="w-10 select-none py-3 text-right pr-2 text-[#444444] bg-[#0c0c0c] border-r border-white/[0.06] text-[11px] leading-relaxed">
          {Array.from({ length: Math.max(stats.lines, 10) }, (_, i) => (
            <div key={i + 1}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          className="flex-1 bg-transparent p-3 text-[#F5F3EE] font-mono text-xs leading-relaxed outline-none resize-y min-h-[200px] placeholder-[#444444] focus:ring-0"
        />
      </div>
    </div>
  );
};

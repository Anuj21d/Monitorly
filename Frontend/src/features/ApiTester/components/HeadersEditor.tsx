import React from 'react';
import { type KeyValueRow } from '../types/apiTester.types';
import { KeyValueTable } from './KeyValueTable';
import { ShieldCheck } from 'lucide-react';

interface HeadersEditorProps {
  headers: KeyValueRow[];
  onUpdateHeader: (id: string, updates: Partial<KeyValueRow>) => void;
  onAddHeader: () => void;
  onRemoveHeader: (id: string) => void;
  onToggleHeader: (id: string) => void;
}

export const HeadersEditor: React.FC<HeadersEditorProps> = ({
  headers,
  onUpdateHeader,
  onAddHeader,
  onRemoveHeader,
  onToggleHeader,
}) => {
  // Quick Presets
  const addPreset = (key: string, value: string) => {
    // Check if key already exists
    const existing = headers.find((h) => h.key.toLowerCase() === key.toLowerCase());
    if (existing) {
      onUpdateHeader(existing.id, { value, enabled: true });
    } else {
      // Add a new row
      onAddHeader();
      // Notice: parent onAddHeader appends, but let's allow user to also quick-fill
    }
  };

  return (
    <div className="space-y-4">
      {/* Informative Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#111111] border border-white/[0.08] text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-[#AAAAAA]">
            Standard request headers are injected automatically. Custom headers override defaults.
          </span>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#888888]">
          <span className="text-[#666666]">Presets:</span>
          <button
            type="button"
            onClick={() => addPreset('Content-Type', 'application/json')}
            className="px-2 py-0.5 rounded bg-[#181818] hover:bg-[#222222] text-[#F5F3EE] border border-white/[0.06] transition-colors"
          >
            + Content-Type
          </button>
          <button
            type="button"
            onClick={() => addPreset('Authorization', 'Bearer <token>')}
            className="px-2 py-0.5 rounded bg-[#181818] hover:bg-[#222222] text-[#F5F3EE] border border-white/[0.06] transition-colors"
          >
            + Authorization
          </button>
        </div>
      </div>

      {/* Headers Table */}
      <KeyValueTable
        rows={headers}
        onUpdateRow={onUpdateHeader}
        onAddRow={onAddHeader}
        onRemoveRow={onRemoveHeader}
        onToggleRow={onToggleHeader}
        keyPlaceholder="e.g. Authorization"
        valuePlaceholder="e.g. Bearer token_xyz"
        descriptionPlaceholder="e.g. API Gateway Token"
        addButtonLabel="Add Header"
      />
    </div>
  );
};

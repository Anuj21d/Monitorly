import React from 'react';
import type { KeyValueRow } from '../types/apiTester.types';
import { Trash2, Plus, Check } from 'lucide-react';

interface KeyValueTableProps {
  rows: KeyValueRow[];
  onUpdateRow: (id: string, updates: Partial<KeyValueRow>) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onToggleRow: (id: string) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  descriptionPlaceholder?: string;
  hideDescription?: boolean;
  addButtonLabel?: string;
}

export const KeyValueTable: React.FC<KeyValueTableProps> = ({
  rows,
  onUpdateRow,
  onAddRow,
  onRemoveRow,
  onToggleRow,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  descriptionPlaceholder = 'Description (optional)',
  hideDescription = false,
  addButtonLabel = 'Add Parameter',
}) => {
  return (
    <div className="w-full flex flex-col font-sans">
      <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-[#111111]/70">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-[#151515] border-b border-white/[0.08] text-[11px] font-mono tracking-wider uppercase text-[#888888]">
          <div className="col-span-1 flex items-center justify-center">
            <span>Act</span>
          </div>
          <div className={hideDescription ? 'col-span-5' : 'col-span-4'}>
            <span>Key</span>
          </div>
          <div className={hideDescription ? 'col-span-5' : 'col-span-4'}>
            <span>Value</span>
          </div>
          {!hideDescription && (
            <div className="col-span-2">
              <span>Description</span>
            </div>
          )}
          <div className="col-span-1 text-right">
            <span>Del</span>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/[0.04]">
          {rows.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#666666] font-mono">
              No entries configured. Click "{addButtonLabel}" below to add one.
            </div>
          ) : (
            rows.map((row, idx) => (
              <div
                key={row.id || idx}
                className={`grid grid-cols-12 gap-2 px-3 py-1.5 items-center hover:bg-[#151515]/60 transition-colors ${
                  !row.enabled ? 'opacity-50' : ''
                }`}
              >
                {/* Active Checkbox */}
                <div className="col-span-1 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => onToggleRow(row.id)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors focus:outline-none ${
                      row.enabled
                        ? 'bg-[#FF5A5F] border-[#FF5A5F] text-white'
                        : 'border-white/20 bg-transparent hover:border-white/40'
                    }`}
                    title={row.enabled ? 'Disable parameter' : 'Enable parameter'}
                    aria-label={`Toggle ${row.key || 'row'}`}
                  >
                    {row.enabled && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                </div>

                {/* Key Input */}
                <div className={hideDescription ? 'col-span-5' : 'col-span-4'}>
                  <input
                    type="text"
                    value={row.key}
                    onChange={(e) => onUpdateRow(row.id, { key: e.target.value })}
                    placeholder={keyPlaceholder}
                    className="w-full bg-[#090909]/80 border border-white/[0.08] focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F]/20 rounded-lg px-2.5 py-1 text-xs text-[#F5F3EE] font-mono placeholder-[#555555] transition-all outline-none"
                  />
                </div>

                {/* Value Input */}
                <div className={hideDescription ? 'col-span-5' : 'col-span-4'}>
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => onUpdateRow(row.id, { value: e.target.value })}
                    placeholder={valuePlaceholder}
                    className="w-full bg-[#090909]/80 border border-white/[0.08] focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F]/20 rounded-lg px-2.5 py-1 text-xs text-[#F5F3EE] font-mono placeholder-[#555555] transition-all outline-none"
                  />
                </div>

                {/* Description Input */}
                {!hideDescription && (
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) => onUpdateRow(row.id, { description: e.target.value })}
                      placeholder={descriptionPlaceholder}
                      className="w-full bg-[#090909]/80 border border-white/[0.08] focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F]/20 rounded-lg px-2.5 py-1 text-xs text-[#AAAAAA] placeholder-[#444444] transition-all outline-none"
                    />
                  </div>
                )}

                {/* Delete Action */}
                <div className="col-span-1 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => onRemoveRow(row.id)}
                    className="p-1 rounded-lg text-[#666666] hover:text-[#FF5A5F] hover:bg-white/[0.05] transition-colors focus:outline-none"
                    title="Delete row"
                    aria-label="Delete row"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Row Button */}
      <div className="mt-2.5 flex items-center justify-between">
        <button
          type="button"
          onClick={onAddRow}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#F5F3EE] bg-[#151515] hover:bg-[#1a1a1a] border border-white/[0.1] hover:border-white/20 transition-all focus:outline-none active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5 text-[#FF5A5F]" />
          <span>{addButtonLabel}</span>
        </button>
        <span className="text-[11px] font-mono text-[#666666]">
          {rows.filter((r) => r.enabled).length} enabled / {rows.length} total
        </span>
      </div>
    </div>
  );
};

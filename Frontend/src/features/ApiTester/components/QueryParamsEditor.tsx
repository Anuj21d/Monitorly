import React from 'react';
import type { KeyValueRow } from '../types/apiTester.types';
import { KeyValueTable } from './KeyValueTable';
import { Globe } from 'lucide-react';

interface QueryParamsEditorProps {
  params: KeyValueRow[];
  fullUrl: string;
  onUpdateParam: (id: string, updates: Partial<KeyValueRow>) => void;
  onAddParam: () => void;
  onRemoveParam: (id: string) => void;
  onToggleParam: (id: string) => void;
}

export const QueryParamsEditor: React.FC<QueryParamsEditorProps> = ({
  params,
  fullUrl,
  onUpdateParam,
  onAddParam,
  onRemoveParam,
  onToggleParam,
}) => {
  return (
    <div className="space-y-4">
      {/* Resulting URL Preview Banner */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111111] border border-white/[0.08] text-xs">
        <Globe className="w-3.5 h-3.5 text-[#FF5A5F] shrink-0" />
        <span className="text-[#888888] font-mono text-[11px] shrink-0">Evaluated URL:</span>
        <span className="font-mono text-[11px] text-[#F5F3EE] truncate select-all">{fullUrl}</span>
      </div>

      {/* Query Parameters Table */}
      <KeyValueTable
        rows={params}
        onUpdateRow={onUpdateParam}
        onAddRow={onAddParam}
        onRemoveRow={onRemoveParam}
        onToggleRow={onToggleParam}
        keyPlaceholder="e.g. limit"
        valuePlaceholder="e.g. 50"
        descriptionPlaceholder="e.g. Items per page"
        addButtonLabel="Add Query Parameter"
      />
    </div>
  );
};

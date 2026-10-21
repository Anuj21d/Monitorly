import React from 'react';
import type { BodyType, HttpMethod, KeyValueRow, RawBodyFormat, RequestBodyConfig } from '../types/apiTester.types';
import { JsonEditor } from './JsonEditor';
import { KeyValueTable } from './KeyValueTable';
import { AlertCircle, FileUp, Check } from 'lucide-react';

interface RequestBodyEditorProps {
  method: HttpMethod;
  body: RequestBodyConfig;
  onChange: (body: RequestBodyConfig) => void;
}

export const RequestBodyEditor: React.FC<RequestBodyEditorProps> = ({ method, body, onChange }) => {
  const isBodyDiscouraged = method === 'GET' || method === 'HEAD';

  const handleTypeChange = (type: BodyType) => {
    onChange({
      ...body,
      type,
    });
  };

  const handleJsonChange = (json: string) => {
    onChange({
      ...body,
      json,
    });
  };

  const handleRawChange = (raw: string) => {
    onChange({
      ...body,
      raw,
    });
  };

  const handleRawFormatChange = (rawFormat: RawBodyFormat) => {
    onChange({
      ...body,
      rawFormat,
    });
  };

  // UrlEncoded CRUD
  const updateUrlEncodedRow = (id: string, updates: Partial<KeyValueRow>) => {
    onChange({
      ...body,
      urlencoded: body.urlencoded.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    });
  };

  const addUrlEncodedRow = () => {
    onChange({
      ...body,
      urlencoded: [
        ...body.urlencoded,
        { id: `ue-${Date.now()}`, key: '', value: '', description: '', enabled: true },
      ],
    });
  };

  const removeUrlEncodedRow = (id: string) => {
    onChange({
      ...body,
      urlencoded: body.urlencoded.filter((r) => r.id !== id),
    });
  };

  const toggleUrlEncodedRow = (id: string) => {
    onChange({
      ...body,
      urlencoded: body.urlencoded.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    });
  };

  // FormData CRUD
  const updateFormDataRow = (id: string, updates: Partial<KeyValueRow>) => {
    onChange({
      ...body,
      formdata: body.formdata.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    });
  };

  const addFormDataRow = () => {
    onChange({
      ...body,
      formdata: [
        ...body.formdata,
        { id: `fd-${Date.now()}`, key: '', value: '', description: '', enabled: true },
      ],
    });
  };

  const removeFormDataRow = (id: string) => {
    onChange({
      ...body,
      formdata: body.formdata.filter((r) => r.id !== id),
    });
  };

  const toggleFormDataRow = (id: string) => {
    onChange({
      ...body,
      formdata: body.formdata.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    });
  };

  const handleBinaryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange({
        ...body,
        binaryFileName: file.name,
        binaryFileSize: file.size,
      });
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Warning if Method is GET or HEAD */}
      {isBodyDiscouraged && body.type !== 'none' && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            The <strong>{method}</strong> method typically does not support a payload in the HTTP specification.
            Your body configuration is saved, but standard gateways may discard it.
          </span>
        </div>
      )}

      {/* Body Mode Selector */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#111111] border border-white/[0.08] text-xs">
        {[
          { id: 'none' as BodyType, label: 'none' },
          { id: 'json' as BodyType, label: 'JSON' },
          { id: 'raw' as BodyType, label: 'raw text' },
          { id: 'urlencoded' as BodyType, label: 'x-www-form-urlencoded' },
          { id: 'formdata' as BodyType, label: 'form-data' },
          { id: 'binary' as BodyType, label: 'binary' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleTypeChange(item.id)}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all flex items-center gap-1.5 ${
              body.type === item.id
                ? 'bg-[#1e1e1e] border border-[#FF5A5F] text-[#F5F3EE] font-semibold'
                : 'text-[#888888] hover:text-[#CCCCCC] hover:bg-white/[0.03] border border-transparent'
            }`}
          >
            {body.type === item.id && <Check className="w-3 h-3 text-[#FF5A5F]" />}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Body Content Areas */}
      {body.type === 'none' && (
        <div className="py-12 text-center text-xs text-[#666666] font-mono border border-white/[0.06] rounded-xl bg-[#111111]/40">
          This request does not have a body. Select JSON or another mode above to configure payload data.
        </div>
      )}

      {body.type === 'json' && (
        <JsonEditor value={body.json} onChange={handleJsonChange} />
      )}

      {body.type === 'raw' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] text-[#888888]">Raw payload format:</span>
            <div className="flex items-center gap-1">
              {(['text', 'html', 'xml', 'javascript'] as RawBodyFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => handleRawFormatChange(fmt)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors ${
                    body.rawFormat === fmt
                      ? 'bg-[#FF5A5F]/20 text-[#FF5A5F] border border-[#FF5A5F]/40'
                      : 'bg-[#151515] text-[#888888] hover:text-[#CCCCCC]'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={body.raw}
            onChange={(e) => handleRawChange(e.target.value)}
            placeholder="Type raw text payload here..."
            className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F]/20 rounded-xl p-3 text-xs font-mono text-[#F5F3EE] min-h-[220px] outline-none"
          />
        </div>
      )}

      {body.type === 'urlencoded' && (
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-[#888888]">
            Content-Type will be automatically set to <code className="text-[#F5F3EE]">application/x-www-form-urlencoded</code>.
          </div>
          <KeyValueTable
            rows={body.urlencoded}
            onUpdateRow={updateUrlEncodedRow}
            onAddRow={addUrlEncodedRow}
            onRemoveRow={removeUrlEncodedRow}
            onToggleRow={toggleUrlEncodedRow}
            keyPlaceholder="field_name"
            valuePlaceholder="field_value"
            addButtonLabel="Add Form Field"
          />
        </div>
      )}

      {body.type === 'formdata' && (
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-[#888888]">
            Multipart form data fields with key-value pairs or file attachments.
          </div>
          <KeyValueTable
            rows={body.formdata}
            onUpdateRow={updateFormDataRow}
            onAddRow={addFormDataRow}
            onRemoveRow={removeFormDataRow}
            onToggleRow={toggleFormDataRow}
            keyPlaceholder="field_or_file_key"
            valuePlaceholder="text value or filename.ext"
            addButtonLabel="Add Multipart Field"
          />
        </div>
      )}

      {body.type === 'binary' && (
        <div className="p-6 rounded-xl border border-white/[0.08] bg-[#111111] text-center space-y-3">
          <FileUp className="w-8 h-8 text-[#FF5A5F] mx-auto" />
          <div className="text-xs font-semibold text-[#F5F3EE]">Binary File Upload (Preview Mode)</div>
          <p className="text-[11px] text-[#888888] max-w-sm mx-auto">
            Attach binary file data (images, PDFs, archives). File payload streaming connects in future Express backend integration.
          </p>

          <div className="pt-2">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1e1e1e] hover:bg-[#282828] border border-white/[0.1] text-xs font-mono text-[#F5F3EE] cursor-pointer transition-all">
              <input type="file" onChange={handleBinaryFileSelect} className="hidden" />
              <span>Select Binary File...</span>
            </label>
          </div>

          {body.binaryFileName && (
            <div className="inline-block mt-3 px-3 py-1.5 rounded-lg bg-[#181818] border border-white/[0.08] text-xs font-mono text-emerald-400">
              Attached: {body.binaryFileName} ({body.binaryFileSize ? `${(body.binaryFileSize / 1024).toFixed(1)} KB` : 'file'})
            </div>
          )}
        </div>
      )}
    </div>
  );
};

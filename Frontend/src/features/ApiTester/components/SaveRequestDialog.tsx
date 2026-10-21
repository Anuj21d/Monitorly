import React, { useState } from 'react';
import type { ApiCollection } from '../types/apiTester.types';
import { X, Bookmark, Folder, Layers, AlertCircle } from 'lucide-react';

interface SaveRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, collectionId: string, folderId?: string) => void;
  initialName: string;
  collections: ApiCollection[];
  defaultCollectionId?: string;
  defaultFolderId?: string;
}

export const SaveRequestDialog: React.FC<SaveRequestDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialName,
  collections,
  defaultCollectionId,
  defaultFolderId,
}) => {
  const [name, setName] = useState(initialName || 'New Request');
  const [selectedCollectionId, setSelectedCollectionId] = useState(
    defaultCollectionId || collections[0]?.id || ''
  );
  const [selectedFolderId, setSelectedFolderId] = useState<string>(
    defaultFolderId || ''
  );
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedCollection = collections.find((c) => c.id === selectedCollectionId);
  const availableFolders = selectedCollection?.folders || [];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Request name is required.');
      return;
    }
    if (!selectedCollectionId) {
      setError('Please choose a destination collection.');
      return;
    }
    onSave(name.trim(), selectedCollectionId, selectedFolderId || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-sans animate-fadeIn">
      <div className="w-full max-w-md bg-[#121212] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#161616]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#FF5A5F]" />
            <h3 className="text-sm font-bold text-[#F5F3EE]">Save Request to Collection</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#888888] hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-xs text-[#FF5A5F] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Request Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#F5F3EE]">Request Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setError(null);
                setName(e.target.value);
              }}
              placeholder="e.g. GET Users by Page"
              className="w-full bg-[#090909] border border-white/[0.1] focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F]/20 rounded-xl px-3.5 py-2 text-xs font-mono text-[#F5F3EE] outline-none transition-all"
              autoFocus
            />
          </div>

          {/* Collection Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#F5F3EE] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#FF5A5F]" />
              <span>Collection</span>
            </label>
            <select
              value={selectedCollectionId}
              onChange={(e) => {
                setSelectedCollectionId(e.target.value);
                setSelectedFolderId('');
              }}
              className="w-full bg-[#090909] border border-white/[0.1] focus:border-[#FF5A5F] rounded-xl px-3.5 py-2 text-xs text-[#F5F3EE] outline-none"
            >
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          {/* Folder Selector (Optional) */}
          {availableFolders.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F3EE] flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>Folder (Optional)</span>
              </label>
              <select
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
                className="w-full bg-[#090909] border border-white/[0.1] focus:border-[#FF5A5F] rounded-xl px-3.5 py-2 text-xs text-[#F5F3EE] outline-none"
              >
                <option value="">(Root Collection)</option>
                {availableFolders.map((f) => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="text-[11px] text-[#777777] bg-[#0a0a0a] p-2.5 rounded-lg border border-white/[0.04]">
            Saved to local state for immediate re-use across the workspace.
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#888888] hover:text-white hover:bg-white/[0.05] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#FF5A5F] hover:bg-[#FF4349] text-white text-xs font-semibold shadow-md shadow-[#FF5A5F]/20 transition-all"
            >
              Save Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

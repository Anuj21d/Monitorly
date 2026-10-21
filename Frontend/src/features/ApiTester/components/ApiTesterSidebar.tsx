import React, { useState, useMemo } from 'react';
import type {
  ApiCollection,
  ApiRequestConfig,
  RequestHistoryItem,
} from '../types/apiTester.types';
import { RequestHistory } from './RequestHistory';
import {
  Plus,
  Layers,
  History,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  X,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
} from 'lucide-react';

export interface ApiTesterSidebarProps {
  collections: ApiCollection[];
  history: RequestHistoryItem[];
  currentRequestId: string;
  onSelectRequest: (config: ApiRequestConfig) => void;
  onNewRequest: () => void;
  onClearHistory: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const ApiTesterSidebar: React.FC<ApiTesterSidebarProps> = ({
  collections,
  history,
  currentRequestId,
  onSelectRequest,
  onNewRequest,
  onClearHistory,
  isCollapsed = false,
  onToggleCollapse = () => {},
}) => {
  const [activeSidebarTab, setActiveSidebarTab] = useState<'collections' | 'history'>('collections');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({
    'col-1': true,
    'col-2': true,
  });
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'f-1': true,
  });

  const toggleCollection = (colId: string) => {
    setExpandedCollections((prev) => ({ ...prev, [colId]: !prev[colId] }));
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const methodBadges: Record<string, { text: string; bg: string }> = {
    GET: { text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    POST: { text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    PUT: { text: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    PATCH: { text: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    DELETE: { text: 'text-[#FF5A5F]', bg: 'bg-[#FF5A5F]/10 border-[#FF5A5F]/20' },
    HEAD: { text: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
    OPTIONS: { text: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
  };

  // Filter collections and requests based on search query
  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return collections;
    const q = searchQuery.toLowerCase();

    return collections
      .map((col) => {
        const matchingRootReqs = col.requests.filter(
          (r) => r.name.toLowerCase().includes(q) || r.url.toLowerCase().includes(q) || r.method.toLowerCase().includes(q)
        );

        const matchingFolders = col.folders
          .map((folder) => {
            const matchingFolderReqs = folder.requests.filter(
              (r) => r.name.toLowerCase().includes(q) || r.url.toLowerCase().includes(q) || r.method.toLowerCase().includes(q)
            );
            const folderMatches = folder.name.toLowerCase().includes(q);
            if (folderMatches || matchingFolderReqs.length > 0) {
              return {
                ...folder,
                requests: matchingFolderReqs.length > 0 ? matchingFolderReqs : folder.requests,
              };
            }
            return null;
          })
          .filter(Boolean) as typeof col.folders;

        const colMatches = col.name.toLowerCase().includes(q);
        if (colMatches || matchingRootReqs.length > 0 || matchingFolders.length > 0) {
          return {
            ...col,
            requests: matchingRootReqs,
            folders: matchingFolders,
          };
        }
        return null;
      })
      .filter(Boolean) as ApiCollection[];
  }, [collections, searchQuery]);

  const totalRequestsCount = useMemo(() => {
    let count = 0;
    collections.forEach((c) => {
      count += c.requests.length;
      c.folders.forEach((f) => {
        count += f.requests.length;
      });
    });
    return count;
  }, [collections]);

  // Collapsed Mini Rail
  if (isCollapsed) {
    return (
      <div className="w-14 h-[760px] bg-[#111111] border border-white/[0.08] rounded-2xl flex flex-col items-center justify-between py-3.5 select-none font-sans shadow-sm">
        <div className="flex flex-col items-center gap-3">
          {/* Expand Button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            title="Expand Collections panel"
            className="p-2 rounded-xl text-[#888888] hover:text-[#F5F3EE] hover:bg-white/[0.06] transition-colors"
          >
            <PanelLeftOpen className="w-4 h-4 text-[#FF5A5F]" />
          </button>

          <div className="w-6 h-px bg-white/[0.08] my-1" />

          {/* Quick New Request */}
          <button
            type="button"
            onClick={onNewRequest}
            title="New Request"
            className="w-8 h-8 rounded-xl bg-[#FF5A5F] hover:bg-[#FF4349] text-white flex items-center justify-center shadow-md shadow-[#FF5A5F]/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Quick Collections tab */}
          <button
            type="button"
            onClick={() => {
              onToggleCollapse();
              setActiveSidebarTab('collections');
            }}
            title="View Collections"
            className="p-2 rounded-xl text-[#888888] hover:text-[#F5F3EE] hover:bg-white/[0.06] transition-colors"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Quick History tab */}
          <button
            type="button"
            onClick={() => {
              onToggleCollapse();
              setActiveSidebarTab('history');
            }}
            title="View History"
            className="p-2 rounded-xl text-[#888888] hover:text-[#F5F3EE] hover:bg-white/[0.06] transition-colors relative"
          >
            <History className="w-4 h-4" />
            {history.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A5F] absolute top-1.5 right-1.5" />
            )}
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono text-[#555555]">API</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[760px] bg-[#111111] border border-white/[0.08] rounded-2xl flex flex-col select-none font-sans overflow-hidden shadow-sm">
      {/* 1. Panel Header */}
      <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between gap-2 bg-[#131313]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#181818] border border-white/[0.1] flex items-center justify-center text-[#FF5A5F]">
            <Layers className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#F5F3EE] tracking-tight">Collections</div>
            <div className="text-[10px] font-mono text-[#777777]">
              {collections.length} collections · {totalRequestsCount} endpoints
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Quick New Request */}
          <button
            type="button"
            onClick={onNewRequest}
            title="New Request"
            className="p-1.5 rounded-lg text-[#888888] hover:text-[#FF5A5F] hover:bg-white/[0.06] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Collapse Panel Button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            title="Collapse Collections panel"
            className="p-1.5 rounded-lg text-[#888888] hover:text-[#F5F3EE] hover:bg-white/[0.06] transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Search & Segmented Switcher */}
      <div className="p-3 border-b border-white/[0.08] space-y-2.5 bg-[#0f0f0f]">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search endpoints..."
            className="w-full bg-[#161616] border border-white/[0.08] rounded-xl pl-8.5 pr-7 py-1.5 text-xs text-[#F5F3EE] placeholder-[#555555] outline-none focus:border-[#FF5A5F]/60 transition-colors font-mono"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#CCCCCC]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Collections vs History Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#161616] border border-white/[0.06] text-xs">
          <button
            type="button"
            onClick={() => setActiveSidebarTab('collections')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-all ${
              activeSidebarTab === 'collections'
                ? 'bg-[#222222] text-[#F5F3EE] shadow-xs'
                : 'text-[#888888] hover:text-[#CCCCCC]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Collections</span>
            <span className="text-[10px] font-mono text-[#666666]">({totalRequestsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSidebarTab('history')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-all ${
              activeSidebarTab === 'history'
                ? 'bg-[#222222] text-[#F5F3EE] shadow-xs'
                : 'text-[#888888] hover:text-[#CCCCCC]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
            <span className="text-[10px] font-mono text-[#666666]">({history.length})</span>
          </button>
        </div>
      </div>

      {/* 3. Tree Content / History View */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-xs custom-scrollbar">
        {activeSidebarTab === 'collections' ? (
          filteredCollections.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <Layers className="w-8 h-8 text-[#444444] mx-auto mb-2 opacity-50" />
              <p className="text-xs text-[#777777] font-sans">No matching requests found</p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs text-[#FF5A5F] hover:underline font-sans"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCollections.map((col) => {
                const isColExpanded = expandedCollections[col.id] !== false;
                const colRequestsCount =
                  col.requests.length +
                  col.folders.reduce((acc, f) => acc + f.requests.length, 0);

                return (
                  <div key={col.id} className="rounded-xl overflow-hidden">
                    {/* Collection Row */}
                    <button
                      type="button"
                      onClick={() => toggleCollection(col.id)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-white/[0.04] transition-colors group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isColExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-[#666666] shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-[#666666] shrink-0" />
                        )}
                        <span className="font-sans font-semibold text-[#F5F3EE] text-xs truncate">
                          {col.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#666666] font-mono">
                        {colRequestsCount}
                      </span>
                    </button>

                    {/* Collection Items */}
                    {isColExpanded && (
                      <div className="pl-3 pr-1 py-0.5 space-y-0.5 border-l border-white/[0.06] ml-4 my-1">
                        {/* Folders */}
                        {col.folders.map((folder) => {
                          const isFolderExpanded = expandedFolders[folder.id] !== false;
                          return (
                            <div key={folder.id} className="space-y-0.5">
                              <button
                                type="button"
                                onClick={() => toggleFolder(folder.id)}
                                className="w-full flex items-center justify-between px-2 py-1 rounded-md text-left hover:bg-white/[0.04] transition-colors group text-[#AAAAAA]"
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  {isFolderExpanded ? (
                                    <FolderOpen className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                                  ) : (
                                    <Folder className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                                  )}
                                  <span className="font-sans text-xs truncate font-medium text-[#CCCCCC]">
                                    {folder.name}
                                  </span>
                                </div>
                                <span className="text-[10px] text-[#555555]">
                                  {folder.requests.length}
                                </span>
                              </button>

                              {/* Folder Requests */}
                              {isFolderExpanded && (
                                <div className="pl-3 space-y-0.5 border-l border-white/[0.06] ml-3 my-0.5">
                                  {folder.requests.map((req) => {
                                    const isSelected = req.id === currentRequestId;
                                    const badge = methodBadges[req.method] || methodBadges.GET;
                                    return (
                                      <button
                                        key={req.id}
                                        type="button"
                                        onClick={() => onSelectRequest(req.config)}
                                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-all ${
                                          isSelected
                                            ? 'bg-[#1e1e1e] border border-[#FF5A5F]/40 text-[#F5F3EE] shadow-xs'
                                            : 'hover:bg-white/[0.03] text-[#999999] hover:text-[#F5F3EE]'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 truncate">
                                          <span
                                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${badge.text} ${badge.bg}`}
                                          >
                                            {req.method}
                                          </span>
                                          <span className="font-sans text-xs truncate">
                                            {req.name}
                                          </span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Root Requests */}
                        {col.requests.map((req) => {
                          const isSelected = req.id === currentRequestId;
                          const badge = methodBadges[req.method] || methodBadges.GET;
                          return (
                            <button
                              key={req.id}
                              type="button"
                              onClick={() => onSelectRequest(req.config)}
                              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-all ${
                                isSelected
                                  ? 'bg-[#1e1e1e] border border-[#FF5A5F]/40 text-[#F5F3EE] shadow-xs'
                                  : 'hover:bg-white/[0.03] text-[#999999] hover:text-[#F5F3EE]'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${badge.text} ${badge.bg}`}
                                >
                                  {req.method}
                                </span>
                                <span className="font-sans text-xs truncate">
                                  {req.name}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <RequestHistory
            history={history}
            onSelectHistoryItem={onSelectRequest}
            onClearHistory={onClearHistory}
          />
        )}
      </div>

      {/* 4. Explorer Status Footer */}
      <div className="p-3 border-t border-white/[0.08] bg-[#0f0f0f] flex items-center justify-between text-[11px] font-mono text-[#777777]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Sandbox Ready</span>
        </div>
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>TLS 1.3</span>
        </div>
      </div>
    </div>
  );
};

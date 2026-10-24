import React, { useState } from "react";
import { useApiRequest } from "../hooks/useApiRequest";
import { ApiTesterSidebar } from "../components/ApiTesterSidebar";
import { RequestWorkspace } from "../components/RequestWorkspace";
import {
  ChevronDown,
  X,
  Check,
  Plus,
  Bookmark,
  MoreVertical,
  Terminal,
  Copy,
  RotateCcw,
  PanelLeft,
} from "lucide-react";
import Navbar from "../../Dashboard/components/Navbar";

interface ApiTesterPageProps {
  onNavigateToDashboard?: () => void;
  onNavigateToMonitors?: () => void;
  onBackToLanding?: () => void;
  onOpenFigmaSpec?: () => void;
}

export const ApiTesterPage: React.FC<ApiTesterPageProps> = () => {
  const requestHook = useApiRequest();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [, setProfileDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    "production" | "staging" | "sandbox"
  >("production");
  const [isEnvDropdownOpen, setIsEnvDropdownOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  // Compute active hierarchy breadcrumb
  const activePath = (() => {
    for (const c of requestHook.collections) {
      const rootReq = c.requests.find((r) => r.id === requestHook.requestId);
      if (rootReq) {
        return {
          collection: c.name,
          folder: null,
          request: rootReq.name,
        };
      }
      for (const f of c.folders) {
        const folderReq = f.requests.find(
          (r) => r.id === requestHook.requestId,
        );
        if (folderReq) {
          return {
            collection: c.name,
            folder: f.name,
            request: folderReq.name,
          };
        }
      }
    }

    if (requestHook.parentCollectionId) {
      const c = requestHook.collections.find(
        (col) => col.id === requestHook.parentCollectionId,
      );
      if (c) {
        let fName: string | null = null;
        if (requestHook.parentFolderId) {
          const f = c.folders.find(
            (fol) => fol.id === requestHook.parentFolderId,
          );
          if (f) fName = f.name;
        }
        return {
          collection: c.name,
          folder: fName,
          request: requestHook.requestName,
        };
      }
    }

    return {
      collection: "My APIs",
      folder: "Authentication",
      request: requestHook.requestName || "Login Endpoint",
    };
  })();

  const handleCopyCurl = () => {
    let curl = `curl -X ${requestHook.method} "${requestHook.fullUrl}"`;
    requestHook.headers
      .filter((h) => h.enabled && h.key)
      .forEach((h) => {
        curl += ` \\\n  -H "${h.key}: ${h.value}"`;
      });
    if (requestHook.auth.type === "bearer" && requestHook.auth.bearer.token) {
      curl += ` \\\n  -H "Authorization: Bearer ${requestHook.auth.bearer.token}"`;
    }
    if (requestHook.body.type === "json" && requestHook.body.json) {
      curl += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${requestHook.body.json.replace(/'/g, "\\'")}'`;
    }

    navigator.clipboard.writeText(curl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const methodColors: Record<string, string> = {
    GET: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    POST: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    PUT: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    PATCH: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    DELETE: "text-[#FF5A5F] bg-[#FF5A5F]/10 border-[#FF5A5F]/20",
    HEAD: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    OPTIONS: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  };

  return (
    <div
      className="min-h-screen bg-[#090909] text-[#F5F3EE] flex flex-col font-sans selection:bg-[#FF5A5F] selection:text-white antialiased"
      onClick={() => {
        setProfileDropdownOpen(false);
        setIsEnvDropdownOpen(false);
        setIsMoreActionsOpen(false);
      }}
    >
      {/* ============================================================== */}
      {/* 1. TOP NAVIGATION (Cohesive Monitorly Authenticated App Shell) */}
      {/* ============================================================== */}
      <Navbar />

      {/* ============================================================== */}
      {/* 2. MAIN APPLICATION WORKSPACE CONTENT                         */}
      {/* ============================================================== */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 sm:py-10 space-y-6">
        {/* ============================================================== */}
        {/* PAGE HEADER: Title, Breadcrumbs & Global Actions              */}
        {/* ============================================================== */}
        <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-4 border-b border-white/[0.06]">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#666666] mb-1 font-bold">
              Developer Tools
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-[-0.03em] text-[#F5F3EE] font-display">
              API Tester
            </h1>

            {/* Breadcrumb row: My APIs / Authentication / Login */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs font-mono text-[#888888]">
              <span className="text-[#AAAAAA]">{activePath.collection}</span>
              <span className="text-[#555555]">/</span>
              {activePath.folder && (
                <>
                  <span className="text-[#AAAAAA]">{activePath.folder}</span>
                  <span className="text-[#555555]">/</span>
                </>
              )}
              <span className="text-[#F5F3EE] font-semibold">
                {activePath.request}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  methodColors[requestHook.method] || methodColors.GET
                }`}
              >
                {requestHook.method}
              </span>
              {!requestHook.isSaved && (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                  Unsaved
                </span>
              )}

              {/* Collections Panel Toggle Indicator */}
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                className="ml-2 flex items-center gap-1 text-[11px] font-sans text-[#777777] hover:text-[#F5F3EE] transition-colors"
                title="Toggle Collections Panel"
              >
                <PanelLeft className="w-3.5 h-3.5 text-[#FF5A5F]" />
                <span className="hidden md:inline">
                  {isSidebarCollapsed
                    ? "Show Collections"
                    : "Collapse Collections"}
                </span>
              </button>
            </div>
          </div>

          {/* Action Buttons: Environment, New Request, Save, More */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Environment Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEnvDropdownOpen((prev) => !prev);
                  setProfileDropdownOpen(false);
                  setIsMoreActionsOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111111] hover:bg-[#161616] border border-white/[0.1] text-xs font-mono text-[#CCCCCC] transition-colors shadow-xs"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    selectedEnvironment === "production"
                      ? "bg-emerald-400"
                      : selectedEnvironment === "staging"
                        ? "bg-amber-400"
                        : "bg-cyan-400"
                  }`}
                />
                <span className="capitalize">{selectedEnvironment}</span>
                <ChevronDown className="w-3 h-3 text-[#777777]" />
              </button>

              {isEnvDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 p-1.5 rounded-2xl bg-[#151515] border border-white/[0.12] shadow-2xl space-y-1 text-xs z-50 animate-fadeIn font-sans"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#777777]">
                    Active Environment
                  </div>
                  {(["production", "staging", "sandbox"] as const).map(
                    (env) => (
                      <button
                        key={env}
                        type="button"
                        onClick={() => {
                          setSelectedEnvironment(env);
                          setIsEnvDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-white/[0.06] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              env === "production"
                                ? "bg-emerald-400"
                                : env === "staging"
                                  ? "bg-amber-400"
                                  : "bg-cyan-400"
                            }`}
                          />
                          <span className="capitalize text-[#F5F3EE]">
                            {env}
                          </span>
                        </div>
                        {selectedEnvironment === env && (
                          <Check className="w-3.5 h-3.5 text-[#FF5A5F]" />
                        )}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* + New Request Button */}
            <button
              type="button"
              onClick={requestHook.resetRequest}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5A5F] hover:bg-[#FF4349] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#FF5A5F]/20 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Request</span>
            </button>

            {/* Save Button */}
            <button
              type="button"
              onClick={() => setIsSaveModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151515] hover:bg-[#1c1c1c] border border-white/[0.12] text-[#F5F3EE] font-semibold text-xs transition-all active:scale-[0.98]"
            >
              <Bookmark className="w-4 h-4 text-[#FF5A5F]" />
              <span>Save</span>
            </button>

            {/* More Actions Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMoreActionsOpen((prev) => !prev);
                  setProfileDropdownOpen(false);
                  setIsEnvDropdownOpen(false);
                }}
                className="p-2 rounded-xl bg-[#151515] hover:bg-[#1c1c1c] border border-white/[0.12] text-[#999999] hover:text-[#F5F3EE] transition-all"
                aria-label="More actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isMoreActionsOpen && (
                <div
                  className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-[#151515] border border-white/[0.12] shadow-2xl p-1 z-50 text-xs font-sans animate-fadeIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      handleCopyCurl();
                      setIsMoreActionsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[#CCCCCC] hover:text-white hover:bg-white/[0.05] transition-colors"
                  >
                    <Terminal className="w-3.5 h-3.5 text-[#FF5A5F]" />
                    <span>{copiedCurl ? "Copied cURL!" : "Copy as cURL"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      requestHook.duplicateRequest();
                      setIsMoreActionsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[#CCCCCC] hover:text-white hover:bg-white/[0.05] transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#888888]" />
                    <span>Duplicate Request</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      requestHook.resetRequest();
                      setIsMoreActionsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[#FF5A5F] hover:bg-[#FF5A5F]/10 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Workspace</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* WORKSPACE 2-COLUMN CONTAINER: Collections + Request Workbench   */}
        {/* ============================================================== */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left: Collections & History Panel (In-Workspace Card) */}
          <div
            className={`transition-all duration-200 shrink-0 w-full ${
              isSidebarCollapsed ? "lg:w-14" : "lg:w-72 xl:w-80"
            }`}
          >
            <ApiTesterSidebar
              collections={requestHook.collections}
              history={requestHook.history}
              currentRequestId={requestHook.requestId}
              onSelectRequest={requestHook.loadRequestConfig}
              onNewRequest={requestHook.resetRequest}
              onClearHistory={requestHook.clearHistory}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            />
          </div>

          {/* Right: Request Workbench (URL Bar, Tabs, Response Viewer) */}
          <div className="flex-1 min-w-0 w-full">
            <RequestWorkspace
              requestHook={requestHook}
              isSaveModalOpen={isSaveModalOpen}
              onOpenSaveModal={() => setIsSaveModalOpen(true)}
              onCloseSaveModal={() => setIsSaveModalOpen(false)}
            />
          </div>
        </div>
      </main>

      {/* ============================================================== */}
      {/* 3. SETTINGS MODAL                                              */}
      {/* ============================================================== */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111111] text-[#F5F3EE] border border-white/[0.12] rounded-[24px] max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#FF5A5F] font-bold">
                  Workspace Settings
                </div>
                <h3 className="text-2xl font-bold mt-1 font-display">
                  Settings
                </h3>
                <p className="text-xs text-[#888888] mt-0.5">
                  Configure alerting channels and edge monitoring preferences.
                </p>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg text-[#888888] hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#090909] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#F5F3EE]">
                    Slack Alerting
                  </div>
                  <div className="text-xs text-[#888888]">
                    Post incident notifications to #infra-alerts
                  </div>
                </div>
                <span className="text-[11px] font-mono font-semibold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                  Connected
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#090909] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#F5F3EE]">
                    Email Notifications
                  </div>
                  <div className="text-xs text-[#888888]">
                    anujdandavate@gmail.com
                  </div>
                </div>
                <span className="text-[11px] font-mono font-semibold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#090909] border border-white/[0.06] space-y-1.5">
                <div className="font-bold text-sm text-[#F5F3EE]">
                  API Access Token
                </div>
                <div className="font-mono text-[#888888] text-[11px] break-all">
                  mon_live_sec_8849204910284759201948572019385
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#FF5A5F] hover:bg-[#ff4349] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#FF5A5F]/15"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

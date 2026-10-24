import React from "react";
import type { UseApiRequestReturn } from "../hooks/useApiRequest";
import { RequestUrlBar } from "./RequestUrlBar";
import { RequestTabs } from "./RequestTabs";
import { ResponseViewer } from "./ResponseViewer";
import { SaveRequestDialog } from "./SaveRequestDialog";

interface RequestWorkspaceProps {
  requestHook: UseApiRequestReturn;
  isSaveModalOpen: boolean;
  onOpenSaveModal: () => void;
  onCloseSaveModal: () => void;
}

export const RequestWorkspace: React.FC<RequestWorkspaceProps> = ({
  requestHook,
  isSaveModalOpen,
  onOpenSaveModal,
  onCloseSaveModal,
}) => {
  const {
    method,
    setMethod,
    fullUrl,
    onUrlChange,
    params,
    updateParam,
    addParam,
    removeParam,
    toggleParam,
    headers,
    updateHeader,
    addHeader,
    removeHeader,
    toggleHeader,
    auth,
    setAuth,
    body,
    setBody,
    scripts,
    setScripts,
    settings,
    setSettings,
    activeRequestTab,
    setActiveRequestTab,
    activeResponseTab,
    setActiveResponseTab,
    responseViewMode,
    setResponseViewMode,
    isLoading,
    response,
    executeSimulatedRequest,
    resetRequest,
    duplicateRequest,
    saveRequestLocally,
    requestName,
    collections,
    parentCollectionId,
    parentFolderId,
    requestMode,
    setRequestMode,
  } = requestHook;

  return (
    <div className="space-y-6 flex-1 min-w-0 font-sans">
      {/* Request execution mode */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-[#888888]">Request mode</span>

        <div className="flex rounded-lg border border-white/10 bg-[#111111] p-1">
          <button
            type="button"
            onClick={() => setRequestMode("external")}
            className={`rounded-md px-3 py-2 text-xs transition-colors ${
              requestMode === "external"
                ? "bg-[#FF5A5F] text-white"
                : "text-[#999999] hover:text-white"
            }`}
          >
            External API
          </button>

          <button
            type="button"
            onClick={() => setRequestMode("local")}
            className={`rounded-md px-3 py-2 text-xs transition-colors ${
              requestMode === "local"
                ? "bg-[#FF5A5F] text-white"
                : "text-[#999999] hover:text-white"
            }`}
          >
            Local API
          </button>
        </div>
      </div>

      <RequestUrlBar
        method={method}
        onMethodChange={setMethod}
        url={fullUrl}
        onUrlChange={onUrlChange}
        onSend={executeSimulatedRequest}
        isLoading={isLoading}
        onSave={onOpenSaveModal}
        onDuplicate={duplicateRequest}
        onReset={resetRequest}
      />

      {/* 2. Request Configuration Tabs */}
      <RequestTabs
        method={method}
        fullUrl={fullUrl}
        params={params}
        headers={headers}
        auth={auth}
        body={body}
        scripts={scripts}
        settings={settings}
        activeTab={activeRequestTab}
        onTabChange={setActiveRequestTab}
        onUpdateParam={updateParam}
        onAddParam={addParam}
        onRemoveParam={removeParam}
        onToggleParam={toggleParam}
        onUpdateHeader={updateHeader}
        onAddHeader={addHeader}
        onRemoveHeader={removeHeader}
        onToggleHeader={toggleHeader}
        onAuthChange={setAuth}
        onBodyChange={setBody}
        onScriptsChange={setScripts}
        onSettingsChange={setSettings}
      />

      {/* 3. Response Workspace Panel */}
      <ResponseViewer
        response={response}
        isLoading={isLoading}
        activeTab={activeResponseTab}
        onTabChange={setActiveResponseTab}
        viewMode={responseViewMode}
        onViewModeChange={setResponseViewMode}
        onTriggerSend={executeSimulatedRequest}
      />

      {/* Save Request Dialog Modal */}
      <SaveRequestDialog
        isOpen={isSaveModalOpen}
        onClose={onCloseSaveModal}
        onSave={saveRequestLocally}
        initialName={requestName}
        collections={collections}
        defaultCollectionId={parentCollectionId}
        defaultFolderId={parentFolderId}
      />
    </div>
  );
};

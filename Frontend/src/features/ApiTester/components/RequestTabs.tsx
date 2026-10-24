import React from 'react';
import type {
  AuthConfig,
  HttpMethod,
  KeyValueRow,
  RequestBodyConfig,
  RequestScripts,
  RequestSettings,
  RequestTabKey,
} from '../types/apiTester.types';
import { QueryParamsEditor } from './QueryParamsEditor';
import { AuthorizationEditor } from './AuthorizationEditor';
import { HeadersEditor } from './HeadersEditor';
import { RequestBodyEditor } from './RequestBodyEditor';
import { Code, Settings as SettingsIcon, Sparkles } from 'lucide-react';

interface RequestTabsProps {
  method: HttpMethod;
  fullUrl: string;
  params: KeyValueRow[];
  headers: KeyValueRow[];
  auth: AuthConfig;
  body: RequestBodyConfig;
  scripts: RequestScripts;
  settings: RequestSettings;
  activeTab: RequestTabKey;
  onTabChange: (tab: RequestTabKey) => void;
  onUpdateParam: (id: string, updates: Partial<KeyValueRow>) => void;
  onAddParam: () => void;
  onRemoveParam: (id: string) => void;
  onToggleParam: (id: string) => void;
  onUpdateHeader: (id: string, updates: Partial<KeyValueRow>) => void;
  onAddHeader: () => void;
  onRemoveHeader: (id: string) => void;
  onToggleHeader: (id: string) => void;
  onAuthChange: (auth: AuthConfig) => void;
  onBodyChange: (body: RequestBodyConfig) => void;
  onScriptsChange: (scripts: RequestScripts) => void;
  onSettingsChange: (settings: RequestSettings) => void;
}

export const RequestTabs: React.FC<RequestTabsProps> = ({
  method,
  fullUrl,
  params,
  headers,
  auth,
  body,
  scripts,
  settings,
  activeTab,
  onTabChange,
  onUpdateParam,
  onAddParam,
  onRemoveParam,
  onToggleParam,
  onUpdateHeader,
  onAddHeader,
  onRemoveHeader,
  onToggleHeader,
  onAuthChange,
  onBodyChange,
  onScriptsChange,
  onSettingsChange,
}) => {
  const enabledParamsCount = params.filter((p) => p.enabled && p.key.trim().length > 0).length;
  const enabledHeadersCount = headers.filter((h) => h.enabled && h.key.trim().length > 0).length;

  return (
    <div className="flex flex-col bg-[#111111] rounded-2xl border border-white/[0.08] overflow-hidden font-sans">
      {/* Tab Navigation Header */}
      <div className="flex items-center gap-1 px-3 pt-2 border-b border-white/[0.08] bg-[#0d0d0d] overflow-x-auto no-scrollbar">
        {/* Params Tab */}
        <button
          type="button"
          onClick={() => onTabChange('params')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'params'
              ? 'border-[#FF5A5F] text-[#F5F3EE] bg-[#151515]'
              : 'border-transparent text-[#888888] hover:text-[#CCCCCC] hover:bg-[#151515]/40'
          }`}
        >
          <span>Params</span>
          {enabledParamsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#FF5A5F]/15 text-[#FF5A5F] text-[10px] font-mono">
              {enabledParamsCount}
            </span>
          )}
        </button>

        {/* Authorization Tab */}
        <button
          type="button"
          onClick={() => onTabChange('auth')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'auth'
              ? 'border-[#FF5A5F] text-[#F5F3EE] bg-[#151515]'
              : 'border-transparent text-[#888888] hover:text-[#CCCCCC] hover:bg-[#151515]/40'
          }`}
        >
          <span>Authorization</span>
          {auth.type !== 'none' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          )}
        </button>

        {/* Headers Tab */}
        <button
          type="button"
          onClick={() => onTabChange('headers')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'headers'
              ? 'border-[#FF5A5F] text-[#F5F3EE] bg-[#151515]'
              : 'border-transparent text-[#888888] hover:text-[#CCCCCC] hover:bg-[#151515]/40'
          }`}
        >
          <span>Headers</span>
          {enabledHeadersCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[#CCCCCC] text-[10px] font-mono">
              {enabledHeadersCount}
            </span>
          )}
        </button>

        {/* Body Tab */}
        <button
          type="button"
          onClick={() => onTabChange('body')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'body'
              ? 'border-[#FF5A5F] text-[#F5F3EE] bg-[#151515]'
              : 'border-transparent text-[#888888] hover:text-[#CCCCCC] hover:bg-[#151515]/40'
          }`}
        >
          <span>Body</span>
          {body.type !== 'none' && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#FF5A5F]/15 text-[#FF5A5F] text-[10px] font-mono uppercase">
              {body.type}
            </span>
          )}
        </button>

        {/* Scripts Tab */}
        <button
          type="button"
          onClick={() => onTabChange('scripts')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'scripts'
              ? 'border-[#FF5A5F] text-[#F5F3EE] bg-[#151515]'
              : 'border-transparent text-[#888888] hover:text-[#CCCCCC] hover:bg-[#151515]/40'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Scripts</span>
        </button>

        {/* Settings Tab */}
        <button
          type="button"
          onClick={() => onTabChange('settings')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-[#FF5A5F] text-[#F5F3EE] bg-[#151515]'
              : 'border-transparent text-[#888888] hover:text-[#CCCCCC] hover:bg-[#151515]/40'
          }`}
        >
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </div>

      {/* Tab Content Panel */}
      <div className="p-4 bg-[#111111]">
        {activeTab === 'params' && (
          <QueryParamsEditor
            params={params}
            fullUrl={fullUrl}
            onUpdateParam={onUpdateParam}
            onAddParam={onAddParam}
            onRemoveParam={onRemoveParam}
            onToggleParam={onToggleParam}
          />
        )}

        {activeTab === 'auth' && (
          <AuthorizationEditor auth={auth} onChange={onAuthChange} />
        )}

        {activeTab === 'headers' && (
          <HeadersEditor
            headers={headers}
            onUpdateHeader={onUpdateHeader}
            onAddHeader={onAddHeader}
            onRemoveHeader={onRemoveHeader}
            onToggleHeader={onToggleHeader}
          />
        )}

        {activeTab === 'body' && (
          <RequestBodyEditor method={method} body={body} onChange={onBodyChange} />
        )}

        {activeTab === 'scripts' && (
          <div className="space-y-6">
            {/* Informational Callout */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#151515] border border-white/[0.08] text-xs text-[#999999]">
              <Sparkles className="w-4 h-4 text-[#FF5A5F] shrink-0" />
              <span>
                Pre-request hooks and assertions are staged for Phase 2 backend sandboxing. Scripts will not execute arbitrary JS in this UI prototype.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pre-Request Script */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-semibold text-[#F5F3EE] flex items-center gap-1.5">
                    <span>Pre-request Script</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#777777]">Executes before dispatch</span>
                </div>
                <textarea
                  value={scripts.preRequest}
                  onChange={(e) => onScriptsChange({ ...scripts, preRequest: e.target.value })}
                  placeholder="// e.g. pm.environment.set('timestamp', Date.now());"
                  className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F]/20 rounded-xl p-3 text-xs font-mono text-[#F5F3EE] min-h-[220px] outline-none"
                />
              </div>

              {/* Post-Response Assertions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-semibold text-[#F5F3EE] flex items-center gap-1.5">
                    <span>Post-response Tests</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#777777]">Runs against response payload</span>
                </div>
                <textarea
                  value={scripts.tests}
                  onChange={(e) => onScriptsChange({ ...scripts, tests: e.target.value })}
                  placeholder="// e.g. pm.test('Status is 200', () => pm.response.to.have.status(200));"
                  className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F]/20 rounded-xl p-3 text-xs font-mono text-[#F5F3EE] min-h-[220px] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div className="p-4 rounded-xl bg-[#0e0e0e] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#F5F3EE]">Request Timeout</div>
                  <div className="text-[11px] text-[#888888]">
                    Maximum time in milliseconds before aborting the request.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={settings.timeoutMs}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        timeoutMs: Math.max(500, parseInt(e.target.value) || 5000),
                      })
                    }
                    className="w-24 bg-[#151515] border border-white/[0.1] rounded-lg px-2.5 py-1 text-xs font-mono text-[#F5F3EE] text-right outline-none focus:border-[#FF5A5F]"
                  />
                  <span className="text-xs font-mono text-[#666666]">ms</span>
                </div>
              </div>

              <div className="h-[1px] bg-white/[0.06]" />

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#F5F3EE]">Follow Redirects</div>
                  <div className="text-[11px] text-[#888888]">
                    Automatically follow HTTP 3xx redirect responses.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onSettingsChange({
                      ...settings,
                      followRedirects: !settings.followRedirects,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 focus:outline-none ${
                    settings.followRedirects ? 'bg-[#FF5A5F]' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.followRedirects ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="h-[1px] bg-white/[0.06]" />

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#F5F3EE] flex items-center gap-2">
                    <span>SSL Certificate Verification</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-[#888888]">
                      Server-side
                    </span>
                  </div>
                  <div className="text-[11px] text-[#888888]">
                    Verify SSL / TLS certificate validity when running backend checks.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onSettingsChange({
                      ...settings,
                      sslVerification: !settings.sslVerification,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 focus:outline-none ${
                    settings.sslVerification ? 'bg-[#FF5A5F]' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.sslVerification ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

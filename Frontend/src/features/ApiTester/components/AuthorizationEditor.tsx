import React, { useState } from "react";
import type { AuthConfig, AuthType } from "../types/apiTester.types";
import { KeyRound, Eye, EyeOff, Shield, Lock, Info } from "lucide-react";

interface AuthorizationEditorProps {
  auth: AuthConfig;
  onChange: (auth: AuthConfig) => void;
}

export const AuthorizationEditor: React.FC<AuthorizationEditorProps> = ({
  auth,
  onChange,
}) => {
  const [showBearerToken, setShowBearerToken] = useState(false);
  const [showBasicPassword, setShowBasicPassword] = useState(false);
  const [showApiKeyValue, setShowApiKeyValue] = useState(false);

  const handleTypeChange = (type: AuthType) => {
    switch (type) {
      case "none":
        onChange({ type: "none" });
        break;

      case "bearer":
        onChange({
          type: "bearer",
          bearer: auth.type === "bearer" ? auth.bearer : { token: "" },
        });
        break;

      case "basic":
        onChange({
          type: "basic",
          basic:
            auth.type === "basic" ? auth.basic : { username: "", password: "" },
        });
        break;

      case "apikey":
        onChange({
          type: "apikey",
          apiKey:
            auth.type === "apikey"
              ? auth.apiKey
              : { key: "", value: "", addTo: "header" },
        });
        break;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#111111] border border-white/[0.08] text-xs text-[#999999]">
        <Info className="w-4 h-4 text-[#FF5A5F] shrink-0" />
        <span>
          Authentication headers and query parameters are dynamically computed
          and maintained in browser memory.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Type Selection */}
        <div className="md:col-span-4 space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-[#888888]">
            Type
          </label>
          <div className="space-y-1">
            {[
              {
                id: "none" as AuthType,
                label: "No Auth",
                desc: "No credentials sent",
              },
              {
                id: "bearer" as AuthType,
                label: "Bearer Token",
                desc: "OAuth 2.0 / JWT token",
              },
              {
                id: "basic" as AuthType,
                label: "Basic Auth",
                desc: "Username & Password",
              },
              {
                id: "apikey" as AuthType,
                label: "API Key",
                desc: "Header or Query Param",
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTypeChange(item.id)}
                className={`w-full text-left px-3 py-2 rounded-xl border transition-all text-xs flex items-center justify-between ${
                  auth.type === item.id
                    ? "bg-[#181818] border-[#FF5A5F] text-[#F5F3EE] shadow-sm"
                    : "bg-[#111111]/50 border-white/[0.06] text-[#888888] hover:bg-[#151515] hover:text-[#CCCCCC]"
                }`}
              >
                <div>
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-[10px] text-[#666666] font-mono">
                    {item.desc}
                  </div>
                </div>
                {auth.type === item.id && (
                  <div className="w-2 h-2 rounded-full bg-[#FF5A5F]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Configuration Form */}
        <div className="md:col-span-8 p-4 rounded-xl bg-[#111111] border border-white/[0.08] space-y-4">
          {auth.type === "none" && (
            <div className="py-10 text-center space-y-2">
              <Shield className="w-8 h-8 text-[#555555] mx-auto" />
              <div className="text-xs text-[#888888]">
                This request does not use any authorization headers.
              </div>
              <div className="text-[11px] text-[#555555]">
                Select Bearer Token, Basic Auth, or API Key from the left to
                configure.
              </div>
            </div>
          )}

          {auth.type === "bearer" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#F5F3EE] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#FF5A5F]" />
                  <span>Bearer Token</span>
                </label>
                <span className="text-[10px] font-mono text-[#888888]">
                  Authorization: Bearer &lt;token&gt;
                </span>
              </div>

              <div className="relative">
                <input
                  type={showBearerToken ? "text" : "password"}
                  value={auth.bearer.token}
                  onChange={(e) =>
                    onChange({
                      ...auth,
                      bearer: { ...auth.bearer, token: e.target.value },
                    })
                  }
                  placeholder="e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full bg-[#090909] border border-white/[0.1] focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F]/20 rounded-lg px-3 py-2 pr-10 text-xs font-mono text-[#F5F3EE] placeholder-[#555555] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowBearerToken(!showBearerToken)}
                  className="absolute right-2.5 top-2.5 text-[#666666] hover:text-[#CCCCCC] transition-colors"
                  title={showBearerToken ? "Hide token" : "Show token"}
                >
                  {showBearerToken ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="text-[11px] text-[#666666] leading-relaxed">
                The token is automatically prefixed with{" "}
                <code className="text-[#F5F3EE] font-mono">Bearer </code> and
                sent in the{" "}
                <code className="text-[#F5F3EE] font-mono">Authorization</code>{" "}
                header.
              </div>
            </div>
          )}

          {auth.type === "basic" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#F5F3EE] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#FF5A5F]" />
                  <span>Basic Authentication</span>
                </label>
                <span className="text-[10px] font-mono text-[#888888]">
                  Base64-encoded credentials
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-[#888888] block mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={auth.basic.username}
                    onChange={(e) =>
                      onChange({
                        ...auth,
                        basic: { ...auth.basic, username: e.target.value },
                      })
                    }
                    placeholder="Username or client identifier"
                    className="w-full bg-[#090909] border border-white/[0.1] focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F]/20 rounded-lg px-3 py-2 text-xs font-mono text-[#F5F3EE] placeholder-[#555555] outline-none transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono text-[#888888]">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showBasicPassword ? "text" : "password"}
                      value={auth.basic.password}
                      onChange={(e) =>
                        onChange({
                          ...auth,
                          basic: { ...auth.basic, password: e.target.value },
                        })
                      }
                      placeholder="Password or secret key"
                      className="w-full bg-[#090909] border border-white/[0.1] focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F]/20 rounded-lg px-3 py-2 pr-10 text-xs font-mono text-[#F5F3EE] placeholder-[#555555] outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowBasicPassword(!showBasicPassword)}
                      className="absolute right-2.5 top-2.5 text-[#666666] hover:text-[#CCCCCC] transition-colors"
                      title={
                        showBasicPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showBasicPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {auth.type === "apikey" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#F5F3EE] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#FF5A5F]" />
                  <span>API Key</span>
                </label>
                <span className="text-[10px] font-mono text-[#888888]">
                  Custom Key / Value pair
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#888888] block mb-1">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={auth.apiKey.key}
                    onChange={(e) =>
                      onChange({
                        ...auth,
                        apiKey: { ...auth.apiKey, key: e.target.value },
                      })
                    }
                    placeholder="e.g. X-API-Key"
                    className="w-full bg-[#090909] border border-white/[0.1] focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F]/20 rounded-lg px-3 py-2 text-xs font-mono text-[#F5F3EE] placeholder-[#555555] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#888888] block mb-1">
                    Add To
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...auth,
                          apiKey: { ...auth.apiKey, addTo: "header" },
                        })
                      }
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                        auth.apiKey.addTo === "header"
                          ? "bg-[#1e1e1e] border-[#FF5A5F] text-[#F5F3EE]"
                          : "bg-[#090909] border-white/[0.08] text-[#888888]"
                      }`}
                    >
                      Header
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...auth,
                          apiKey: { ...auth.apiKey, addTo: "query" },
                        })
                      }
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                        auth.apiKey.addTo === "query"
                          ? "bg-[#1e1e1e] border-[#FF5A5F] text-[#F5F3EE]"
                          : "bg-[#090909] border-white/[0.08] text-[#888888]"
                      }`}
                    >
                      Query Param
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#888888] block mb-1">
                  Key Value
                </label>
                <div className="relative">
                  <input
                    type={showApiKeyValue ? "text" : "password"}
                    value={auth.apiKey.value}
                    onChange={(e) =>
                      onChange({
                        ...auth,
                        apiKey: { ...auth.apiKey, value: e.target.value },
                      })
                    }
                    placeholder="API key secret value"
                    className="w-full bg-[#090909] border border-white/[0.1] focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F]/20 rounded-lg px-3 py-2 pr-10 text-xs font-mono text-[#F5F3EE] placeholder-[#555555] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKeyValue(!showApiKeyValue)}
                    className="absolute right-2.5 top-2.5 text-[#666666] hover:text-[#CCCCCC] transition-colors"
                    title={showApiKeyValue ? "Hide key" : "Show key"}
                  >
                    {showApiKeyValue ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

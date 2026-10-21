import { useState, useCallback, useMemo } from 'react';
import type {
  HttpMethod,
  KeyValueRow,
  AuthConfig,
  RequestBodyConfig,
  RequestScripts,
  RequestSettings,
  RequestTabKey,
  ResponseTabKey,
  ResponseBodyViewMode,
  ApiResponseData,
  RequestHistoryItem,
  ApiCollection,
  SavedRequest,
  ApiRequestConfig,
} from '../types/apiTester.types';
import { applyParamsToUrl, parseUrlQuery, validateUrl } from '../utils/queryParams';

const DEFAULT_AUTH: AuthConfig = {
  type: 'bearer',
  bearer: { token: 'mp_live_8f3a524b0179e0' },
  basic: { username: 'admin', password: 'secret_password_123' },
  apiKey: { key: 'X-API-Key', value: 'mon_key_live_9921', addTo: 'header' },
};

const DEFAULT_BODY: RequestBodyConfig = {
  type: 'none',
  json: JSON.stringify(
    {
      service: 'PaymentGateway',
      environment: 'production',
      metrics: {
        collectLatency: true,
        alertThresholdMs: 500,
      },
    },
    null,
    2
  ),
  raw: '',
  rawFormat: 'text',
  urlencoded: [
    { id: 'ue-1', key: 'grant_type', value: 'client_credentials', description: 'OAuth grant flow', enabled: true },
    { id: 'ue-2', key: 'client_id', value: 'pulse_client_488', description: '', enabled: true },
  ],
  formdata: [
    { id: 'fd-1', key: 'certificate', value: 'cert_chain.pem', description: 'TLS cert', enabled: true },
  ],
};

const DEFAULT_SCRIPTS: RequestScripts = {
  preRequest: `// ⚡ Monitorly Pre-Request Script
// Compute dynamic timestamp header
pm.environment.set("timestamp", Date.now().toString());
`,
  tests: `// ⚡ Monitorly Post-Response Assertions
pm.test("Status code is 200 OK", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is under 250ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(250);
});

pm.test("Service status is healthy", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql("healthy");
});`,
};

const DEFAULT_SETTINGS: RequestSettings = {
  timeoutMs: 5000,
  followRedirects: true,
  sslVerification: true,
  customName: '',
};

const INITIAL_PARAMS: KeyValueRow[] = [
  { id: 'p1', key: 'environment', value: 'production', description: 'Target deployment ring', enabled: true },
  { id: 'p2', key: 'region', value: 'us-east-1', description: 'Cluster region', enabled: true },
  { id: 'p3', key: 'verbose', value: 'true', description: 'Detailed health telemetry', enabled: false },
];

const INITIAL_HEADERS: KeyValueRow[] = [
  { id: 'h1', key: 'Accept', value: 'application/json', description: 'Accepted response content-type', enabled: true },
  { id: 'h2', key: 'User-Agent', value: 'Monitorly-Agent/2.4', description: 'Client identification', enabled: true },
  { id: 'h3', key: 'Cache-Control', value: 'no-cache', description: 'Bypass edge cache', enabled: false },
];

const INITIAL_COLLECTIONS: ApiCollection[] = [
  {
    id: 'col-1',
    name: 'My APIs',
    folders: [
      {
        id: 'f-1',
        name: 'Authentication',
        collectionId: 'col-1',
        requests: [
          {
            id: 'req-auth-1',
            name: 'POST Login',
            method: 'POST',
            url: 'https://api.monitorly.io/v1/auth/login',
            collectionId: 'col-1',
            folderId: 'f-1',
            updatedAt: '2 hours ago',
            config: {
              id: 'req-auth-1',
              name: 'POST Login',
              method: 'POST',
              url: 'https://api.monitorly.io/v1/auth/login',
              params: [],
              headers: [{ id: 'h-auth-1', key: 'Content-Type', value: 'application/json', description: '', enabled: true }],
              auth: { ...DEFAULT_AUTH, type: 'none' },
              body: {
                ...DEFAULT_BODY,
                type: 'json',
                json: JSON.stringify({ email: 'anuj@monitorly.io', password: '••••••••' }, null, 2),
              },
              scripts: DEFAULT_SCRIPTS,
              settings: DEFAULT_SETTINGS,
            },
          },
          {
            id: 'req-auth-2',
            name: 'POST Register',
            method: 'POST',
            url: 'https://api.monitorly.io/v1/auth/register',
            collectionId: 'col-1',
            folderId: 'f-1',
            updatedAt: '1 day ago',
            config: {
              id: 'req-auth-2',
              name: 'POST Register',
              method: 'POST',
              url: 'https://api.monitorly.io/v1/auth/register',
              params: [],
              headers: [{ id: 'h-auth-2', key: 'Content-Type', value: 'application/json', description: '', enabled: true }],
              auth: { ...DEFAULT_AUTH, type: 'none' },
              body: {
                ...DEFAULT_BODY,
                type: 'json',
                json: JSON.stringify({ name: 'Anuj', email: 'anuj@monitorly.io', role: 'admin' }, null, 2),
              },
              scripts: DEFAULT_SCRIPTS,
              settings: DEFAULT_SETTINGS,
            },
          },
        ],
      },
    ],
    requests: [
      {
        id: 'req-top-1',
        name: 'GET Users',
        method: 'GET',
        url: 'https://api.monitorly.io/v1/users',
        collectionId: 'col-1',
        updatedAt: '3 hours ago',
        config: {
          id: 'req-top-1',
          name: 'GET Users',
          method: 'GET',
          url: 'https://api.monitorly.io/v1/users',
          params: [{ id: 'p-u1', key: 'page', value: '1', description: 'Page offset', enabled: true }, { id: 'p-u2', key: 'limit', value: '20', description: 'Page size', enabled: true }],
          headers: [{ id: 'h-u1', key: 'Accept', value: 'application/json', description: '', enabled: true }],
          auth: DEFAULT_AUTH,
          body: DEFAULT_BODY,
          scripts: DEFAULT_SCRIPTS,
          settings: DEFAULT_SETTINGS,
        },
      },
    ],
  },
  {
    id: 'col-2',
    name: 'Payment Infrastructure',
    folders: [],
    requests: [
      {
        id: 'req-pay-1',
        name: 'GET Gateway Status',
        method: 'GET',
        url: 'https://api.monitorly.io/v1/payments/health',
        collectionId: 'col-2',
        updatedAt: 'Just now',
        config: {
          id: 'req-pay-1',
          name: 'GET Gateway Status',
          method: 'GET',
          url: 'https://api.monitorly.io/v1/payments/health',
          params: INITIAL_PARAMS,
          headers: INITIAL_HEADERS,
          auth: DEFAULT_AUTH,
          body: DEFAULT_BODY,
          scripts: DEFAULT_SCRIPTS,
          settings: DEFAULT_SETTINGS,
        },
      },
    ],
  },
];

const INITIAL_HISTORY: RequestHistoryItem[] = [
  {
    id: 'hist-1',
    name: 'GET Gateway Status',
    method: 'GET',
    url: 'https://api.monitorly.io/v1/payments/health?environment=production&region=us-east-1',
    status: 200,
    statusText: 'OK',
    durationMs: 142,
    sizeBytes: 1248,
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    requestConfig: {
      id: 'hist-cfg-1',
      name: 'GET Gateway Status',
      method: 'GET',
      url: 'https://api.monitorly.io/v1/payments/health',
      params: INITIAL_PARAMS,
      headers: INITIAL_HEADERS,
      auth: DEFAULT_AUTH,
      body: DEFAULT_BODY,
      scripts: DEFAULT_SCRIPTS,
      settings: DEFAULT_SETTINGS,
    },
  },
  {
    id: 'hist-2',
    name: 'POST Auth Token',
    method: 'POST',
    url: 'https://api.monitorly.io/v1/auth/login',
    status: 200,
    statusText: 'OK',
    durationMs: 98,
    sizeBytes: 842,
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    requestConfig: {
      id: 'hist-cfg-2',
      name: 'POST Auth Token',
      method: 'POST',
      url: 'https://api.monitorly.io/v1/auth/login',
      params: [],
      headers: [{ id: 'h-auth-1', key: 'Content-Type', value: 'application/json', description: '', enabled: true }],
      auth: { ...DEFAULT_AUTH, type: 'none' },
      body: {
        ...DEFAULT_BODY,
        type: 'json',
        json: JSON.stringify({ email: 'anuj@monitorly.io', password: '••••••••' }, null, 2),
      },
      scripts: DEFAULT_SCRIPTS,
      settings: DEFAULT_SETTINGS,
    },
  },
  {
    id: 'hist-3',
    name: 'DELETE Expired Session',
    method: 'DELETE',
    url: 'https://api.monitorly.io/v1/auth/session/sess_99382',
    status: 204,
    statusText: 'No Content',
    durationMs: 76,
    sizeBytes: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    requestConfig: {
      id: 'hist-cfg-3',
      name: 'DELETE Expired Session',
      method: 'DELETE',
      url: 'https://api.monitorly.io/v1/auth/session/sess_99382',
      params: [],
      headers: INITIAL_HEADERS,
      auth: DEFAULT_AUTH,
      body: DEFAULT_BODY,
      scripts: DEFAULT_SCRIPTS,
      settings: DEFAULT_SETTINGS,
    },
  },
];

export function useApiRequest() {
  // Request Identifier & Meta
  const [requestId, setRequestId] = useState<string>('req-default');
  const [requestName, setRequestName] = useState<string>('New Request');
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [parentCollectionId, setParentCollectionId] = useState<string>('col-1');
  const [parentFolderId, setParentFolderId] = useState<string | undefined>(undefined);

  // Core Request Configuration
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [rawBaseUrl, setRawBaseUrl] = useState<string>('https://api.monitorly.io/v1/payments/health');
  const [params, setParams] = useState<KeyValueRow[]>(INITIAL_PARAMS);
  const [headers, setHeaders] = useState<KeyValueRow[]>(INITIAL_HEADERS);
  const [auth, setAuth] = useState<AuthConfig>(DEFAULT_AUTH);
  const [body, setBody] = useState<RequestBodyConfig>(DEFAULT_BODY);
  const [scripts, setScripts] = useState<RequestScripts>(DEFAULT_SCRIPTS);
  const [settings, setSettings] = useState<RequestSettings>(DEFAULT_SETTINGS);

  // Tab Selection
  const [activeRequestTab, setActiveRequestTab] = useState<RequestTabKey>('params');
  const [activeResponseTab, setActiveResponseTab] = useState<ResponseTabKey>('body');
  const [responseViewMode, setResponseViewMode] = useState<ResponseBodyViewMode>('pretty');

  // Execution & Simulation States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ApiResponseData | null>({
    status: 200,
    statusText: 'OK',
    durationMs: 142,
    sizeBytes: 1248,
    timestamp: new Date().toISOString(),
    contentType: 'application/json',
    isSimulatedPreview: true,
    headers: [
      { key: 'content-type', value: 'application/json; charset=utf-8' },
      { key: 'cache-control', value: 'no-cache, no-store' },
      { key: 'x-request-id', value: 'req_live_7718af290b' },
      { key: 'x-cluster-region', value: 'us-east-1' },
      { key: 'x-response-time', value: '142ms' },
      { key: 'server', value: 'MonitorPulse-Edge/3.1' },
    ],
    cookies: [
      {
        name: 'mpsess',
        value: 'sess_993a401c27e8',
        domain: 'api.monitorly.io',
        path: '/',
        httpOnly: true,
        secure: true,
      },
    ],
    testResults: [
      { name: 'Status code is 200 OK', status: 'passed' },
      { name: 'Response time is under 250ms', status: 'passed', message: 'Actual: 142ms' },
      { name: 'Service status is healthy', status: 'passed', message: 'status: "healthy"' },
    ],
    body: JSON.stringify(
      {
        service: 'payments-api',
        status: 'healthy',
        uptime: '99.98%',
        region: 'us-east-1',
        metrics: {
          successRate: 0.9998,
          activeConnections: 1420,
          p95LatencyMs: 184,
          p99LatencyMs: 310,
        },
        checks: [
          { name: 'stripe-connect', status: 'operational', latencyMs: 82 },
          { name: 'redis-cache-cluster', status: 'operational', latencyMs: 4 },
          { name: 'postgresql-primary', status: 'operational', latencyMs: 12 },
        ],
        timestamp: new Date().toISOString(),
      },
      null,
      2
    ),
  });

  // Collections & History
  const [collections, setCollections] = useState<ApiCollection[]>(INITIAL_COLLECTIONS);
  const [history, setHistory] = useState<RequestHistoryItem[]>(INITIAL_HISTORY);

  // Derived Full URL with query parameters
  const fullUrl = useMemo(() => {
    return applyParamsToUrl(rawBaseUrl, params);
  }, [rawBaseUrl, params]);

  // Derived enabled parameter and header counts
  const enabledParamsCount = useMemo(() => params.filter((p) => p.enabled && p.key.trim().length > 0).length, [params]);
  const enabledHeadersCount = useMemo(() => headers.filter((h) => h.enabled && h.key.trim().length > 0).length, [headers]);

  // URL Change Handler: Syncs query parameters when URL is typed or pasted
  const handleUrlChange = useCallback((newUrl: string) => {
    setIsSaved(false);
    const { baseUrl, params: extractedParams } = parseUrlQuery(newUrl);
    setRawBaseUrl(baseUrl);
    if (extractedParams.length > 0) {
      setParams((prev) => {
        // Keep descriptions if existing
        return extractedParams.map((ep) => {
          const match = prev.find((p) => p.key === ep.key);
          return {
            ...ep,
            description: match ? match.description : '',
          };
        });
      });
    }
  }, []);

  // Base URL change without touching params
  const handleBaseUrlChange = useCallback((newBase: string) => {
    setIsSaved(false);
    setRawBaseUrl(newBase.split('?')[0] || '');
  }, []);

  // Params CRUD
  const updateParam = useCallback((id: string, updates: Partial<KeyValueRow>) => {
    setIsSaved(false);
    setParams((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const addParam = useCallback(() => {
    setIsSaved(false);
    const newId = `p-${Date.now()}`;
    setParams((prev) => [...prev, { id: newId, key: '', value: '', description: '', enabled: true }]);
  }, []);

  const removeParam = useCallback((id: string) => {
    setIsSaved(false);
    setParams((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleParam = useCallback((id: string) => {
    setIsSaved(false);
    setParams((prev) => prev.map((p) => (p.id === id ? { ...p, ...enabled(p.enabled) } : p)));
    function enabled(val: boolean) {
      return { enabled: !val };
    }
  }, []);

  // Headers CRUD
  const updateHeader = useCallback((id: string, updates: Partial<KeyValueRow>) => {
    setIsSaved(false);
    setHeaders((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  }, []);

  const addHeader = useCallback(() => {
    setIsSaved(false);
    const newId = `h-${Date.now()}`;
    setHeaders((prev) => [...prev, { id: newId, key: '', value: '', description: '', enabled: true }]);
  }, []);

  const removeHeader = useCallback((id: string) => {
    setIsSaved(false);
    setHeaders((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleHeader = useCallback((id: string) => {
    setIsSaved(false);
    setHeaders((prev) => prev.map((h) => (h.id === id ? { ...h, enabled: !h.enabled } : h)));
  }, []);

  // Method Change
  const handleMethodChange = useCallback((newMethod: HttpMethod) => {
    setIsSaved(false);
    setMethod(newMethod);
  }, []);

  // Load a request config (from saved or history)
  const loadRequestConfig = useCallback((config: ApiRequestConfig) => {
    setRequestId(config.id);
    setRequestName(config.name);
    setMethod(config.method);
    setRawBaseUrl(config.url.split('?')[0]);
    setParams(config.params || []);
    setHeaders(config.headers || []);
    setAuth(config.auth || DEFAULT_AUTH);
    setBody(config.body || DEFAULT_BODY);
    setScripts(config.scripts || DEFAULT_SCRIPTS);
    setSettings(config.settings || DEFAULT_SETTINGS);
    setIsSaved(true);
  }, []);

  // Reset to clean blank request
  const resetRequest = useCallback(() => {
    setRequestId(`req-${Date.now()}`);
    setRequestName('Untitled Request');
    setMethod('GET');
    setRawBaseUrl('https://api.example.com/v1/health');
    setParams([
      { id: `p-${Date.now()}-1`, key: '', value: '', description: '', enabled: true },
    ]);
    setHeaders([
      { id: `h-${Date.now()}-1`, key: 'Accept', value: 'application/json', description: '', enabled: true },
    ]);
    setAuth({ ...DEFAULT_AUTH, type: 'none' });
    setBody({ ...DEFAULT_BODY, type: 'none' });
    setScripts(DEFAULT_SCRIPTS);
    setSettings(DEFAULT_SETTINGS);
    setIsSaved(false);
    setResponse(null);
  }, []);

  // Duplicate current request
  const duplicateRequest = useCallback(() => {
    setRequestId(`req-${Date.now()}`);
    setRequestName((prev) => `${prev} (Copy)`);
    setIsSaved(false);
  }, []);

  // Save current request locally
  const saveRequestLocally = useCallback(
    (name: string, collectionId: string, folderId?: string) => {
      const currentConfig: ApiRequestConfig = {
        id: requestId,
        name: name.trim(),
        method,
        url: fullUrl,
        params,
        headers,
        auth,
        body,
        scripts,
        settings,
      };

      const newSavedRequest: SavedRequest = {
        id: requestId,
        name: name.trim(),
        method,
        url: fullUrl,
        collectionId,
        folderId,
        config: currentConfig,
        updatedAt: 'Just now',
      };

      setCollections((prevCols) => {
        return prevCols.map((col) => {
          if (col.id === collectionId) {
            if (folderId) {
              const updatedFolders = col.folders.map((f) => {
                if (f.id === folderId) {
                  const filtered = f.requests.filter((r) => r.id !== requestId);
                  return { ...f, requests: [newSavedRequest, ...filtered] };
                }
                return f;
              });
              return { ...col, folders: updatedFolders };
            } else {
              const filtered = col.requests.filter((r) => r.id !== requestId);
              return { ...col, requests: [newSavedRequest, ...filtered] };
            }
          }
          return col;
        });
      });

      setRequestName(name.trim());
      setParentCollectionId(collectionId);
      setParentFolderId(folderId);
      setIsSaved(true);
    },
    [requestId, method, fullUrl, params, headers, auth, body, scripts, settings]
  );

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Send Simulated Request: Emits a structured local client preview
  const executeSimulatedRequest = useCallback(() => {
    const { isValid, error } = validateUrl(fullUrl);
    if (!isValid) {
      setResponse({
        status: 400,
        statusText: 'Bad Request (Client URL Error)',
        durationMs: 12,
        sizeBytes: 148,
        timestamp: new Date().toISOString(),
        contentType: 'application/json',
        isSimulatedPreview: true,
        headers: [{ key: 'content-type', value: 'application/json' }],
        cookies: [],
        testResults: [{ name: 'URL Validation Check', status: 'failed', message: error || 'Malformed URL format' }],
        body: JSON.stringify(
          {
            error: 'ClientValidationError',
            message: error || 'Invalid URL destination provided.',
            resolution: 'Please check that the protocol (https://) and domain are properly formed.',
          },
          null,
          2
        ),
      });
      return;
    }

    setIsLoading(true);

    // Simulate realistic execution delay (~350ms to 550ms)
    setTimeout(() => {
      const simulatedDuration = Math.floor(80 + Math.random() * 110);
      const isPostOrPut = method === 'POST' || method === 'PUT' || method === 'PATCH';
      const statusCode = isPostOrPut ? 201 : method === 'DELETE' ? 204 : 200;
      const statusText = isPostOrPut ? 'Created' : method === 'DELETE' ? 'No Content' : 'OK';

      let responsePayload: Record<string, unknown> | null = null;

      if (method === 'DELETE') {
        responsePayload = {
          success: true,
          message: 'Resource decommissioned successfully',
          deletedAt: new Date().toISOString(),
        };
      } else if (isPostOrPut) {
        responsePayload = {
          success: true,
          id: `res_${Math.random().toString(36).slice(2, 9)}`,
          action: `${method} executed`,
          timestamp: new Date().toISOString(),
          echo: {
            authMode: auth.type,
            activeHeadersCount: enabledHeadersCount,
            receivedPayload: body.type === 'json' ? 'JSON parsed' : body.type,
          },
        };
      } else {
        responsePayload = {
          service: 'MonitorPulse Client Runtime',
          status: 'healthy',
          uptime: '99.99%',
          endpoint: fullUrl,
          latencyMs: simulatedDuration,
          timestamp: new Date().toISOString(),
          headersDetected: enabledHeadersCount,
          paramsDetected: enabledParamsCount,
          environment: 'preview-sandbox',
        };
      }

      const bodyStr = responsePayload ? JSON.stringify(responsePayload, null, 2) : '';
      const size = new Blob([bodyStr]).size;

      const newResponse: ApiResponseData = {
        status: statusCode,
        statusText,
        durationMs: simulatedDuration,
        sizeBytes: size,
        timestamp: new Date().toISOString(),
        contentType: 'application/json',
        isSimulatedPreview: true,
        headers: [
          { key: 'content-type', value: 'application/json; charset=utf-8' },
          { key: 'cache-control', value: 'private, no-cache' },
          { key: 'x-served-by', value: 'MonitorPulse-MockEngine' },
          { key: 'x-runtime-ms', value: `${simulatedDuration}ms` },
          { key: 'access-control-allow-origin', value: '*' },
          { key: 'date', value: new Date().toUTCString() },
        ],
        cookies: [
          {
            name: 'mp_session',
            value: `sess_${Date.now()}`,
            domain: 'api.monitorly.io',
            path: '/',
            httpOnly: true,
            secure: true,
          },
        ],
        testResults: [
          { name: `Status code is ${statusCode}`, status: 'passed' },
          { name: 'Response duration is within SLA (< 250ms)', status: 'passed', message: `${simulatedDuration}ms` },
          { name: 'Content-Type is JSON', status: 'passed' },
        ],
        body: bodyStr,
      };

      setResponse(newResponse);
      setIsLoading(false);

      // Add to History
      const historyItem: RequestHistoryItem = {
        id: `hist-${Date.now()}`,
        name: requestName,
        method,
        url: fullUrl,
        status: statusCode,
        statusText,
        durationMs: simulatedDuration,
        sizeBytes: size,
        timestamp: new Date().toISOString(),
        requestConfig: {
          id: requestId,
          name: requestName,
          method,
          url: fullUrl,
          params,
          headers,
          auth,
          body,
          scripts,
          settings,
        },
      };

      setHistory((prev) => [historyItem, ...prev.slice(0, 24)]);
    }, 420);
  }, [
    fullUrl,
    method,
    auth,
    body,
    scripts,
    settings,
    requestId,
    requestName,
    params,
    headers,
    enabledHeadersCount,
    enabledParamsCount,
  ]);

  return {
    // Request identification
    requestId,
    requestName,
    setRequestName: (name: string) => {
      setIsSaved(false);
      setRequestName(name);
    },
    isSaved,
    parentCollectionId,
    parentFolderId,

    // Core Request Configuration
    method,
    setMethod: handleMethodChange,
    baseUrl: rawBaseUrl,
    setBaseUrl: handleBaseUrlChange,
    fullUrl,
    onUrlChange: handleUrlChange,

    // Parameters
    params,
    updateParam,
    addParam,
    removeParam,
    toggleParam,
    enabledParamsCount,

    // Headers
    headers,
    updateHeader,
    addHeader,
    removeHeader,
    toggleHeader,
    enabledHeadersCount,

    // Auth
    auth,
    setAuth: (newAuth: AuthConfig) => {
      setIsSaved(false);
      setAuth(newAuth);
    },

    // Body
    body,
    setBody: (newBody: RequestBodyConfig) => {
      setIsSaved(false);
      setBody(newBody);
    },

    // Scripts
    scripts,
    setScripts: (newScripts: RequestScripts) => {
      setIsSaved(false);
      setScripts(newScripts);
    },

    // Settings
    settings,
    setSettings: (newSettings: RequestSettings) => {
      setIsSaved(false);
      setSettings(newSettings);
    },

    // Tabs
    activeRequestTab,
    setActiveRequestTab,
    activeResponseTab,
    setActiveResponseTab,
    responseViewMode,
    setResponseViewMode,

    // Execution & Response
    isLoading,
    response,
    setResponse,
    executeSimulatedRequest,

    // Actions & Storage
    resetRequest,
    duplicateRequest,
    loadRequestConfig,
    saveRequestLocally,

    // Collections & History
    collections,
    history,
    clearHistory,
  };
}

export type UseApiRequestReturn = ReturnType<typeof useApiRequest>;

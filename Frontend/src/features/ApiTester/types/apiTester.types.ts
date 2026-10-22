export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export interface KeyValueRow {
  id: string;
  key: string;
  value: string;
  description: string;
  enabled: boolean;
}

export type AuthType = "none" | "bearer" | "basic" | "apikey";

export interface BearerAuthConfig {
  token: string;
}

export interface BasicAuthConfig {
  username: string;
  password: string;
}

export interface ApiKeyAuthConfig {
  key: string;
  value: string;
  addTo: "header" | "query";
}

export type AuthConfig =
  | {
      type: "none";
    }
  | {
      type: "bearer";
      bearer: BearerAuthConfig;
    }
  | {
      type: "basic";
      basic: BasicAuthConfig;
    }
  | {
      type: "apikey";
      apiKey: ApiKeyAuthConfig;
    };

export type BodyType =
  | "none"
  | "json"
  | "raw"
  | "urlencoded"
  | "formdata"
  | "binary";

export type RawBodyFormat = "text" | "javascript" | "html" | "xml";

export interface RequestBodyConfig {
  type: BodyType;
  json: string;
  raw: string;
  rawFormat: RawBodyFormat;
  urlencoded: KeyValueRow[];
  formdata: KeyValueRow[];
  binaryFileName?: string;
  binaryFileSize?: number;
}

export interface RequestScripts {
  preRequest: string;
  tests: string;
}

export interface RequestSettings {
  timeoutMs: number;
  followRedirects: boolean;
  sslVerification: boolean;
  customName: string;
}

export type RequestTabKey =
  | "params"
  | "auth"
  | "headers"
  | "body"
  | "scripts"
  | "settings";

export type ResponseTabKey = "body" | "headers" | "cookies" | "tests";

export type ResponseBodyViewMode = "pretty" | "raw" | "preview";

export interface ResponseHeaderItem {
  key: string;
  value: string;
}

export interface ResponseCookieItem {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires?: string;
  httpOnly: boolean;
  secure: boolean;
}

export interface TestResultItem {
  name: string;
  status: "passed" | "failed" | "skipped";
  message?: string;
}

export interface ApiResponseData {
  status: number;
  statusText: string;
  durationMs: number;
  sizeBytes?: number;
  timestamp: string;
  headers: ResponseHeaderItem[];
  cookies?: ResponseCookieItem[];
  body: string;
  contentType: string;
  isSimulatedPreview?: boolean;
  testResults?: TestResultItem[];
}

export type UiRequestStatus = "idle" | "loading" | "success" | "error";

export interface RequestHistoryItem {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  status: number | null;
  statusText: string;
  durationMs: number;
  sizeBytes: number;
  timestamp: string;
  requestConfig: ApiRequestConfig;
  errorMessage?: string;
}

export interface SavedRequest {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  collectionId: string;
  folderId?: string;
  config: ApiRequestConfig;
  updatedAt: string;
}

export interface ApiFolder {
  id: string;
  name: string;
  collectionId: string;
  parentFolderId?: string;
  folders?: ApiFolder[];
  requests: SavedRequest[];
}

export interface ApiCollection {
  id: string;
  name: string;
  folders: ApiFolder[];
  requests: SavedRequest[];
}

export interface ApiRequestConfig {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  params: KeyValueRow[];
  headers: KeyValueRow[];
  auth: AuthConfig;
  body: RequestBodyConfig;
  scripts: RequestScripts;
  settings: RequestSettings;
}

export interface HttpClientConfig {
  baseUrl?: string;
}

const DEFAULT_BASE_URL = (import.meta as any).env?.VITE_API_BASE || '/api';

class HttpClient {
  private baseUrl: string;

  constructor(config?: HttpClientConfig) {
    this.baseUrl = (config && config.baseUrl) || DEFAULT_BASE_URL;
  }

  private buildUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const slashBase = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const slashPath = path.startsWith('/') ? path : `/${path}`;
    return `${slashBase}${slashPath}`;
  }

  async request<T>(
    path: string,
    options: RequestInit & { skipAuth?: boolean } = {},
  ): Promise<T> {
    const url = this.buildUrl(path);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!response.ok) {
      const errorBody = isJson ? await response.json().catch(() => undefined) : undefined;
      const message =
        (errorBody && (errorBody.message || errorBody.error)) ||
        `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    if (!isJson) {
      // @ts-expect-error – caller must know response shape
      return undefined;
    }

    return (await response.json()) as T;
  }

  get<T>(path: string, init?: RequestInit) {
    return this.request<T>(path, { ...(init || {}), method: 'GET' });
  }

  post<T>(path: string, body?: unknown, init?: RequestInit) {
    return this.request<T>(path, {
      ...(init || {}),
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(path: string, init?: RequestInit) {
    return this.request<T>(path, { ...(init || {}), method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();


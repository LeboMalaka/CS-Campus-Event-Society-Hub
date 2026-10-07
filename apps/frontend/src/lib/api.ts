export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code?: string;
    message?: string;
  };
};

export type AcademicBlock = {
  block_name: string;
  block_type: 'EXAM' | 'TEST_WEEK' | 'RECESS' | 'HOLIDAY';
  start_date: string;
  end_date: string;
  severity_level: 3;
};

const configuredApiUrl = (process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:5002/api').trim();
const API_BASE_URL = (() => {
  const noTrailingSlash = configuredApiUrl.replace(/\/+$/, '');

  if (!noTrailingSlash) {
    return 'http://localhost:5002/api';
  }

  if (/\/api$/i.test(noTrailingSlash)) {
    return noTrailingSlash;
  }

  return `${noTrailingSlash}/api`;
})();

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('campus_token') : null;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const normalizedEndpoint = endpoint.replace(/^\/+/, '');
  const requestUrl = /^https?:\/\//i.test(normalizedEndpoint)
    ? normalizedEndpoint
    : new URL(normalizedEndpoint, `${API_BASE_URL.replace(/\/+$/, '')}/`).toString();

  try {
    const response = await fetch(requestUrl, {
      ...options,
      headers,
      cache: 'no-store',
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload?.error?.message || 'Request failed');
    }

    return payload as T;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new Error(error.message);
    }

    throw new Error('Unable to reach the Campus Hub API. Make sure the backend is running and the API URL is configured correctly.');
  }
}

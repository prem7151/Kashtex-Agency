const TOKEN_KEY = 'kashtex_admin_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = {
    ...options.headers,
    ...getAuthHeaders(),
  };
  return fetch(url, { ...options, headers });
}

// Client-side API helper for SINT docs spec management

export interface SpecPost {
  slug: string;
  title: string;
  description: string;
  specId: string;
  tag: string;
  publishedDate: string;
  author: string;
  faqs?: { q: string; a: string }[];
  toc?: { id: string; label: string }[];
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export function normalizeApiUrl(url: string): string {
  return url.trim().replace(/\/api\/?$/, '').replace(/\/$/, '');
}

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('sint_api_url');
    if (saved) return normalizeApiUrl(saved);
  }

  // Environment variable if provided at build time
  if (import.meta.env.PUBLIC_API_URL) {
    return normalizeApiUrl(import.meta.env.PUBLIC_API_URL);
  }

  if (typeof window !== 'undefined') {
    // Auto-detect based on current hostname to prevent Mixed Content
    const host = window.location.hostname;
    if (host === 'sint-org.com' || host.endsWith('.sint-org.com') || host.endsWith('.github.io')) {
      return 'https://api.sint-org.com';
    }
  }

  return 'http://localhost:8000';
}

export function setApiBaseUrl(url: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sint_api_url', normalizeApiUrl(url));
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sint_token');
  }
  return null;
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sint_token', token);
  }
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sint_token');
  }
}

export async function verifySession(): Promise<{ valid: boolean; user?: { username: string; role: string } }> {
  const token = getToken();
  if (!token) return { valid: false };

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      clearToken();
      return { valid: false };
    }
    const data = await res.json();
    return { valid: Boolean(data.authenticated), user: data.user };
  } catch {
    // If API server is unreachable, we do not invalidate token immediately
    return { valid: true };
  }
}

export async function fetchSpecsResult(): Promise<{ success: boolean; specs: SpecPost[]; error?: string }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/specs`);
    if (!res.ok) {
      return { success: false, specs: [], error: `HTTP ${res.status}: ${res.statusText}` };
    }
    const data = await res.json();
    return { success: true, specs: data.specs || [] };
  } catch (err: any) {
    console.warn('Could not fetch specs from API:', err);
    return { success: false, specs: [], error: err.message || 'API サーバーに接続できません' };
  }
}

export async function fetchSpecs(): Promise<SpecPost[]> {
  const result = await fetchSpecsResult();
  return result.specs;
}

export async function fetchSpecBySlug(slug: string): Promise<SpecPost | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/specs/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.spec || null;
  } catch (err) {
    console.warn(`Could not fetch spec ${slug}:`, err);
    return null;
  }
}

export async function saveSpec(spec: Partial<SpecPost>, isNew: boolean): Promise<{ success: boolean; error?: string; spec?: SpecPost }> {
  const token = getToken();
  if (!token) return { success: false, error: 'ログインが必要です（トークンがありません）' };

  const url = isNew
    ? `${getApiBaseUrl()}/api/specs`
    : `${getApiBaseUrl()}/api/specs/${encodeURIComponent(spec.slug!)}`;
  const method = isNew ? 'POST' : 'PUT';

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(spec),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || '保存に失敗しました' };
    }
    return { success: true, spec: data.spec };
  } catch (err: any) {
    return { success: false, error: err.message || '通信エラーが発生しました' };
  }
}

export interface PublicAuthor {
  username: string;
  role: 'admin' | 'editor';
  name?: string;
  bio?: string;
  roleTitle?: string;
  github?: string;
  specialties?: string[];
  nationality?: string;
}

export async function fetchAuthors(): Promise<PublicAuthor[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/authors`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.authors || [];
  } catch {
    return [];
  }
}

export async function fetchAuthorByUsername(username: string): Promise<PublicAuthor | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/authors/${encodeURIComponent(username)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.author || null;
  } catch {
    return null;
  }
}

export async function updateProfile(data: Partial<PublicAuthor>): Promise<{ success: boolean; error?: string; profile?: PublicAuthor }> {
  const token = getToken();
  if (!token) return { success: false, error: 'ログインが必要です' };

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) return { success: false, error: result.error || 'プロフィールの更新に失敗しました' };
    return { success: true, profile: result.profile };
  } catch (err: any) {
    return { success: false, error: err.message || '通信エラー' };
  }
}

export async function deleteSpec(slug: string): Promise<{ success: boolean; error?: string }> {
  const token = getToken();
  if (!token) return { success: false, error: 'ログインが必要です' };

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/specs/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || '削除に失敗しました' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || '通信エラー' };
  }
}

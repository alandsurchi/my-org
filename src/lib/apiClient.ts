import { config } from '../config/env';

// ---------------------------------------------------------------------------
// Types shared with the backend API
// ---------------------------------------------------------------------------
export type Role = 'super_admin' | 'admin' | 'staff';

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
  role: Role;
  isSuperAdmin: boolean;
  createdAt?: string;
  lastLogin?: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  expiresIn: string;
  user: AuthUser;
}

export interface StaffMember extends AuthUser {
  canEdit?: boolean;
  /** Own account or an email pinned in SUPER_ADMINS: cannot be edited or deleted */
  isProtected?: boolean;
}

export interface ImageAsset {
  id: number;
  url: string;
  originalName: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  dimensions: { width: number; height: number };
  uploadedBy: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  uploadedAt?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  category: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'active' | 'completed' | 'planned' | 'on-hold';

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string | null;
  status: ProjectStatus;
  imageUrl: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
  // legacy aliases still returned by the API
  title_en?: string;
  description_en?: string;
  image_url?: string | null;
  created_at?: string;
}

export interface GalleryPhotoRaw {
  id: number;
  url: string;
  title: string;
  description: string;
  caption: string;
  uploadedAt: string;
}

export interface NewsInput {
  title: string;
  content?: string;
  category?: string;
  image?: File | null;
  /** true clears the existing image (ignored when a new image is sent) */
  removeImage?: boolean;
}

export interface ProjectInput {
  title?: string;
  /** legacy alias for title */
  title_en?: string;
  /** legacy alias for description */
  description_en?: string;
  description?: string;
  status?: ProjectStatus | string;
  category?: string;
  location?: string;
  image?: File | null;
  /** true clears the existing image (ignored when a new image is sent) */
  removeImage?: boolean;
}

export interface StaffInput {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export type StaffUpdate = Partial<StaffInput>;

export interface AnalyticsSummary {
  days: number;
  views: number;
  visitors: number;
  byDay: { day: string; views: number; visitors: number }[];
  topPages: { path: string; views: number }[];
  referrers: { referrer: string; views: number }[];
  languages: { lang: string; views: number }[];
  devices: { device: string; views: number }[];
}

export interface BackupInfo {
  tables: Record<string, number>;
  uploads: { bytes: number; files: number };
}

interface Envelope<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const TOKEN_KEYS = ['authToken', 'auth_token'] as const;

export const getStoredToken = (): string | null => {
  for (const key of TOKEN_KEYS) {
    const value = localStorage.getItem(key);
    if (value) return value;
  }
  return null;
};

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------
class APIClient {
  private baseURL: string;

  constructor(baseURL: string = config.apiUrl) {
    this.baseURL = baseURL;
  }

  private authHeaders(isFormData: boolean): Record<string, string> {
    const token = getStoredToken();
    return {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, isFormData = false): Promise<ApiResult<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: { ...this.authHeaders(isFormData), ...(options.headers as Record<string, string> | undefined) },
        signal: controller.signal,
      });

      const json = (await response.json().catch(() => null)) as Envelope<T> | T | null;

      if (!response.ok) {
        const env = (json ?? {}) as Envelope<T>;
        throw new Error(env.message || env.error || `HTTP ${response.status}`);
      }

      // Unwrap { success, data } envelopes; pass raw payloads through.
      const env = json as Envelope<T> | null;
      const data = env && typeof env === 'object' && 'success' in env ? (env.data as T) : (json as T);
      return { data, error: null };
    } catch (error) {
      const isTimeout = error instanceof DOMException && error.name === 'AbortError';
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { data: null, error: isTimeout ? 'Request timed out. The server may be starting up.' : message };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async unwrap<T>(result: ApiResult<T>): Promise<T> {
    if (result.error) throw new Error(result.error);
    return result.data as T;
  }

  // --- Auth ---------------------------------------------------------------
  async login(email: string, password: string): Promise<ApiResult<LoginResponse>> {
    const result = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (result.data?.token) {
      localStorage.setItem('authToken', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
    }
    return result;
  }

  logout() {
    for (const key of TOKEN_KEYS) localStorage.removeItem(key);
    localStorage.removeItem('user');
  }

  getStoredUser(): AuthUser | null {
    try {
      const user = localStorage.getItem('user');
      return user ? (JSON.parse(user) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated() {
    return !!getStoredToken();
  }

  verifyToken() {
    return this.request<{ user: AuthUser }>('/auth/verify');
  }

  getAuthFeatures() {
    return this.request<{ passwordResetEmail: boolean }>('/auth/features');
  }

  /** Always resolves; the server never reveals whether the email exists. */
  async requestPasswordReset(email: string) {
    await fetch(`${this.baseURL}/auth/forgot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).catch(() => undefined);
  }

  resetPassword(token: string, password: string) {
    return this.request<{ message: string }>('/auth/reset', { method: 'POST', body: JSON.stringify({ token, password }) });
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // --- Hero / About -------------------------------------------------------
  getHeroImage() {
    return this.request<ImageAsset>('/hero');
  }

  uploadHeroImage(imageFile: File) {
    const formData = new FormData();
    formData.append('heroImage', imageFile);
    return this.request<ImageAsset>('/hero', { method: 'POST', body: formData }, true);
  }

  getAboutImage() {
    return this.request<ImageAsset>('/about');
  }

  uploadAboutImage(imageFile: File) {
    const formData = new FormData();
    formData.append('aboutImage', imageFile);
    return this.request<ImageAsset>('/about', { method: 'POST', body: formData }, true);
  }

  deleteAboutImage() {
    return this.request<{ message: string }>('/about', { method: 'DELETE' });
  }

  // --- News ---------------------------------------------------------------
  getNews(params?: { limit?: number; category?: string }) {
    const search = new URLSearchParams();
    if (params?.limit) search.set('limit', String(params.limit));
    if (params?.category) search.set('category', params.category);
    const query = search.toString();
    return this.request<NewsItem[]>(`/news${query ? `?${query}` : ''}`);
  }

  async getAllNews(): Promise<NewsItem[]> {
    return (await this.unwrap(await this.getNews())) ?? [];
  }

  async getNewsById(id: string | number): Promise<NewsItem> {
    return this.unwrap(await this.request<NewsItem>(`/news/${id}`));
  }

  private newsForm(input: NewsInput) {
    const formData = new FormData();
    formData.append('title', input.title);
    if (input.content) formData.append('content', input.content);
    if (input.category) formData.append('category', input.category);
    if (input.image) formData.append('image', input.image);
    else if (input.removeImage) formData.append('removeImage', 'true');
    return formData;
  }

  async createNews(input: NewsInput): Promise<NewsItem> {
    return this.unwrap(await this.request<NewsItem>('/news', { method: 'POST', body: this.newsForm(input) }, true));
  }

  async updateNews(id: string | number, input: NewsInput): Promise<NewsItem> {
    return this.unwrap(await this.request<NewsItem>(`/news/${id}`, { method: 'PUT', body: this.newsForm(input) }, true));
  }

  async deleteNews(id: string | number) {
    return this.unwrap(await this.request<{ message: string }>(`/news/${id}`, { method: 'DELETE' }));
  }

  // --- Projects -----------------------------------------------------------
  getProjects(params?: { status?: string; category?: string; limit?: number }) {
    const search = new URLSearchParams();
    if (params?.status) search.set('status', params.status);
    if (params?.category) search.set('category', params.category);
    if (params?.limit) search.set('limit', String(params.limit));
    const query = search.toString();
    return this.request<Project[]>(`/projects${query ? `?${query}` : ''}`);
  }

  async getAllProjects(status?: string): Promise<Project[]> {
    return (await this.unwrap(await this.getProjects({ status }))) ?? [];
  }

  async getProjectById(id: string | number): Promise<Project> {
    return this.unwrap(await this.request<Project>(`/projects/${id}`));
  }

  private projectForm(input: ProjectInput) {
    const formData = new FormData();
    formData.append('title', input.title || input.title_en || '');
    const description = input.description || input.description_en;
    if (description) formData.append('description', description);
    if (input.status) formData.append('status', input.status);
    if (input.category) formData.append('category', input.category);
    if (input.location !== undefined) formData.append('location', input.location);
    if (input.image) formData.append('image', input.image);
    else if (input.removeImage) formData.append('removeImage', 'true');
    return formData;
  }

  async createProject(input: ProjectInput): Promise<Project> {
    return this.unwrap(await this.request<Project>('/projects', { method: 'POST', body: this.projectForm(input) }, true));
  }

  async updateProject(id: string | number, input: ProjectInput): Promise<Project> {
    return this.unwrap(await this.request<Project>(`/projects/${id}`, { method: 'PUT', body: this.projectForm(input) }, true));
  }

  async deleteProject(id: string | number) {
    return this.unwrap(await this.request<{ message: string }>(`/projects/${id}`, { method: 'DELETE' }));
  }

  // --- Gallery ------------------------------------------------------------
  getGallery() {
    return this.request<GalleryPhotoRaw[]>('/gallery');
  }

  async getAllGalleryPhotos(): Promise<GalleryPhotoRaw[]> {
    return (await this.unwrap(await this.getGallery())) ?? [];
  }

  async uploadGalleryPhoto(photoFile: File, caption = ''): Promise<GalleryPhotoRaw> {
    const formData = new FormData();
    formData.append('photo', photoFile);
    formData.append('caption', caption);
    return this.unwrap(await this.request<GalleryPhotoRaw>('/gallery', { method: 'POST', body: formData }, true));
  }

  async updatePhotoCaption(id: string | number, caption: string): Promise<GalleryPhotoRaw> {
    return this.unwrap(await this.request<GalleryPhotoRaw>(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify({ caption }) }));
  }

  async deletePhoto(id: string | number) {
    return this.unwrap(await this.request<{ message: string }>(`/gallery/${id}`, { method: 'DELETE' }));
  }

  // --- Analytics / backup -------------------------------------------------
  getAnalyticsSummary(days = 30) {
    return this.request<AnalyticsSummary>(`/analytics/summary?days=${days}`);
  }

  getBackupInfo() {
    return this.request<BackupInfo>('/backup/info');
  }

  /** Downloads the full backup zip (super admin). Returns the Blob and filename. */
  async downloadBackup(): Promise<{ blob: Blob; filename: string }> {
    const response = await fetch(`${this.baseURL}/backup`, { headers: this.authHeaders(true) });
    if (!response.ok) {
      const env = (await response.json().catch(() => ({}))) as Envelope<unknown>;
      throw new Error(env.message || env.error || `HTTP ${response.status}`);
    }
    const disposition = response.headers.get('content-disposition') || '';
    const filename = /filename="([^"]+)"/.exec(disposition)?.[1] || 'backup.zip';
    return { blob: await response.blob(), filename };
  }

  // --- Staff --------------------------------------------------------------
  getStaff() {
    return this.request<StaffMember[]>('/staff');
  }

  getCurrentUser() {
    return this.request<StaffMember>('/staff/me');
  }

  createStaff(input: StaffInput) {
    return this.request<StaffMember>('/staff', { method: 'POST', body: JSON.stringify(input) });
  }

  updateStaff(id: string | number, input: StaffUpdate) {
    return this.request<StaffMember>(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(input) });
  }

  deleteStaff(id: string | number) {
    return this.request<{ message: string }>(`/staff/${id}`, { method: 'DELETE' });
  }
}

export const apiClient = new APIClient();
export default apiClient;

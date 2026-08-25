import { config } from '../config/env';

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = config.apiUrl) {
    this.baseURL = baseURL;
  }

  // Helper method to set auth header
  private getAuthHeaders(options: RequestInit = {}): HeadersInit {
    const token = localStorage.getItem('authToken') || localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };
  }

  // Helper method for FormData requests
  private getAuthHeadersForFormData(options: RequestInit = {}): HeadersInit {
    const token = localStorage.getItem('authToken') || localStorage.getItem('auth_token');
    return {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {},
    isFormData: boolean = false
  ): Promise<{ data: T | null; error: string | null }> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const headers = isFormData 
        ? this.getAuthHeadersForFormData(options) 
        : this.getAuthHeaders(options);

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
      }

      const json = await response.json();
      
      // Standardize the response to unwrap { success: true, data: result }
      const data = json.success ? json.data : json;

      return { data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // --- Auth Methods ---
  async login(email: string, password: string) {
    const result = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.data?.token) {
      localStorage.setItem('authToken', result.data.token);
      localStorage.setItem('auth_token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
    }

    return result;
  }

  async register(email: string, password: string, role: string = 'staff') {
    return this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    });
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!(localStorage.getItem('authToken') || localStorage.getItem('auth_token'));
  }

  async verifyToken() {
    return this.request<any>('/auth/verify');
  }

  // --- Hero Image Methods ---
  async getHeroImage() {
    return this.request<any>('/hero');
  }

  async uploadHeroImage(imageFile: File) {
    const formData = new FormData();
    formData.append('heroImage', imageFile);
    return this.request<any>('/hero', {
      method: 'POST',
      body: formData
    }, true);
  }

  // --- About Image Methods ---
  async getAboutImage() {
    return this.request<any>('/about');
  }

  async uploadAboutImage(imageFile: File) {
    const formData = new FormData();
    formData.append('aboutImage', imageFile);
    return this.request<any>('/about', {
      method: 'POST',
      body: formData
    }, true);
  }

  async deleteAboutImage() {
    return this.request<any>('/about', {
      method: 'DELETE'
    });
  }

  // --- News Methods ---
  async getNews(params?: { page?: number; limit?: number; category?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    
    const query = searchParams.toString();
    return this.request<any>(`/news${query ? `?${query}` : ''}`);
  }
  
  async getAllNews() { // Alias for compatibility
    const result = await this.getNews();
    if (result.error) throw new Error(result.error);
    return result.data;
  }

  async getNewsById(id: string) {
    return this.request<any>(`/news/${id}`);
  }

  // Unified signature for creating news (supports both formats used in hooks)
  async createNews(titleOrData: any, content?: string, category?: string, imageFile?: File) {
    const formData = new FormData();
    
    if (typeof titleOrData === 'object' && titleOrData !== null) {
       // Called from useNews.ts
       formData.append('title', titleOrData.title_en || titleOrData.title);
       formData.append('content', titleOrData.description_en || titleOrData.description || titleOrData.content);
       if (titleOrData.category) formData.append('category', titleOrData.category);
       if (titleOrData.image) formData.append('image', titleOrData.image);
    } else {
       // Called from useNewsAPI.ts
       formData.append('title', titleOrData);
       if (content) formData.append('content', content);
       if (category) formData.append('category', category);
       if (imageFile) formData.append('image', imageFile);
    }

    const result = await this.request<any>('/news', {
      method: 'POST',
      body: formData
    }, true);

    if (result.error) throw new Error(result.error);
    return result.data;
  }

  async updateNews(id: string, titleOrData: any, content?: string, imageFile?: File) {
    const formData = new FormData();
    
    if (typeof titleOrData === 'object' && titleOrData !== null) {
       formData.append('title', titleOrData.title_en || titleOrData.title);
       formData.append('content', titleOrData.description_en || titleOrData.description || titleOrData.content);
       if (titleOrData.category) formData.append('category', titleOrData.category);
       if (titleOrData.image) formData.append('image', titleOrData.image);
    } else {
       formData.append('title', titleOrData);
       if (content) formData.append('content', content);
       if (imageFile) formData.append('image', imageFile);
    }

    const result = await this.request<any>(`/news/${id}`, {
      method: 'PUT',
      body: formData
    }, true);
    
    if (result.error) throw new Error(result.error);
    return result.data;
  }

  async deleteNews(id: string) {
    const result = await this.request<any>(`/news/${id}`, { method: 'DELETE' });
    if (result.error) throw new Error(result.error);
    return result.data;
  }

  // --- Projects Methods ---
  async getProjects(paramsOrStatus?: any) {
    let query = '';
    if (typeof paramsOrStatus === 'string') {
        query = `?status=${paramsOrStatus}`;
    } else if (paramsOrStatus && typeof paramsOrStatus === 'object') {
        const searchParams = new URLSearchParams();
        if (paramsOrStatus.page) searchParams.append('page', paramsOrStatus.page.toString());
        if (paramsOrStatus.limit) searchParams.append('limit', paramsOrStatus.limit.toString());
        if (paramsOrStatus.category) searchParams.append('category', paramsOrStatus.category);
        query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    }
    
    return this.request<any>(`/projects${query}`);
  }

  async getAllProjects(status?: string) { // Alias
      const result = await this.getProjects(status);
      if (result.error) throw new Error(result.error);
      return result.data;
  }

  async getProjectById(id: string) {
    return this.request<any>(`/projects/${id}`);
  }

  async createProject(projectData: any) {
    const formData = new FormData();
    formData.append('title', projectData.title_en || projectData.title);
    formData.append('description', projectData.description_en || projectData.description);
    formData.append('status', projectData.status || 'active');
    
    if (projectData.category) formData.append('category', projectData.category);
    if (projectData.location) formData.append('location', projectData.location);
    if (projectData.image) formData.append('image', projectData.image);
    
    const result = await this.request<any>('/projects', {
      method: 'POST',
      body: formData
    }, true);
    
    if (result.error) throw new Error(result.error);
    return result.data;
  }

  async updateProject(id: string, titleOrData: any, description?: string, status?: string, imageFile?: File) {
    const formData = new FormData();
    
    if (typeof titleOrData === 'object' && titleOrData !== null) {
      formData.append('title', titleOrData.title_en || titleOrData.title);
      formData.append('description', titleOrData.description_en || titleOrData.description);
      formData.append('status', titleOrData.status || 'active');
      if (titleOrData.category) formData.append('category', titleOrData.category);
      if (titleOrData.location) formData.append('location', titleOrData.location);
      if (titleOrData.image) formData.append('image', titleOrData.image);
    } else {
      formData.append('title', titleOrData);
      if (description) formData.append('description', description);
      if (status) formData.append('status', status);
      if (imageFile) formData.append('image', imageFile);
    }

    const result = await this.request<any>(`/projects/${id}`, {
      method: 'PUT',
      body: formData
    }, true);
    
    if (result.error) throw new Error(result.error);
    return result.data;
  }

  async deleteProject(id: string) {
    const result = await this.request<any>(`/projects/${id}`, { method: 'DELETE' });
    if (result.error) throw new Error(result.error);
    return result.data;
  }

  // --- Gallery Methods ---
  async getGallery() {
    const response = await this.request<any>('/gallery');
    
    if (response.data && Array.isArray(response.data)) {
      response.data = response.data.map((item: any) => ({
        ...item,
        id: item._id || item.id,
        image_url: item.url.startsWith('http') ? item.url : `${config.cdnUrl}${item.url}`,
        title: item.title || item.caption || 'Untitled',
        description: item.description || '',
        created_at: item.uploadedAt,
        updated_at: item.uploadedAt
      }));
    }
    return response;
  }
  
  async getAllGalleryPhotos() { // Alias
      const result = await this.getGallery();
      if (result.error) throw new Error(result.error);
      return result.data;
  }

  async uploadGalleryPhoto(photoFile: File, caption: string = '') {
    const formData = new FormData();
    formData.append('photo', photoFile);
    formData.append('caption', caption);
    
    const result = await this.request<any>('/gallery', {
      method: 'POST',
      body: formData
    }, true);
    if (result.error) throw new Error(result.error);
    return result.data;
  }

  async createGalleryItem(galleryData: any) {
     return this.uploadGalleryPhoto(galleryData.photo || galleryData.image, galleryData.caption || galleryData.title);
  }

  async updatePhotoCaption(id: string, caption: string) {
    const result = await this.request<any>(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ caption })
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  }

  async deletePhoto(id: string) {
    const result = await this.request<any>(`/gallery/${id}`, { method: 'DELETE' });
    if (result.error) throw new Error(result.error);
    return result.data;
  }

  async deleteGalleryItem(id: string) {
    return this.deletePhoto(id);
  }

  // --- Staff/Users Methods ---
  async getAllUsers() {
    return this.request<any>('/auth/users');
  }

  async getStaff() {
    return this.request<any>('/staff');
  }

  async createStaff(staffData: any) {
    return this.request<any>('/staff', {
      method: 'POST',
      body: JSON.stringify(staffData)
    });
  }

  async updateStaff(id: string, staffData: any) {
    return this.request<any>(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(staffData)
    });
  }

  async deleteStaff(id: string) {
    return this.request<any>(`/staff/${id}`, { method: 'DELETE' });
  }
}

// Create and export a default instance
export const apiClient = new APIClient();

// Create default export for compatibility with charityDashboardAPI alias
export default apiClient;

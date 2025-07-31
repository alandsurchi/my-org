// API Client to replace Supabase integration
class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = 'http://localhost:8080/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: string | null }> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timeout - please check your connection';
        } else {
          errorMessage = error.message;
        }
      }
      
      return { 
        data: null, 
        error: errorMessage
      };
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    const result = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.data?.token) {
      this.token = result.data.token;
      localStorage.setItem('auth_token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
    }

    return result;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  // News API methods
  async getNews(params?: { page?: number; limit?: number; category?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    
    const query = searchParams.toString();
    return this.request(`/news${query ? `?${query}` : ''}`);
  }

  async getNewsById(id: string) {
    return this.request(`/news/${id}`);
  }

  async createNews(newsData: any) {
    return this.request('/news', {
      method: 'POST',
      body: JSON.stringify(newsData),
    });
  }

  async updateNews(id: string, newsData: any) {
    return this.request(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(newsData),
    });
  }

  async deleteNews(id: string) {
    return this.request(`/news/${id}`, {
      method: 'DELETE',
    });
  }

  // Projects API methods
  async getProjects(params?: { page?: number; limit?: number; category?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    
    const query = searchParams.toString();
    return this.request(`/projects${query ? `?${query}` : ''}`);
  }

  async createProject(projectData: any) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: string, projectData: any) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id: string) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Staff API methods
  async getStaff() {
    return this.request('/staff');
  }

  async createStaff(staffData: any) {
    return this.request('/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    });
  }

  async updateStaff(id: string, staffData: any) {
    return this.request(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(staffData),
    });
  }

  async deleteStaff(id: string) {
    return this.request(`/staff/${id}`, {
      method: 'DELETE',
    });
  }

  // Gallery API methods
  async getGallery() {
    return this.request('/gallery');
  }

  async createGalleryItem(galleryData: any) {
    return this.request('/gallery', {
      method: 'POST',
      body: JSON.stringify(galleryData),
    });
  }

  async deleteGalleryItem(id: string) {
    return this.request(`/gallery/${id}`, {
      method: 'DELETE',
    });
  }

  // Website Images API methods
  async getWebsiteImages() {
    return this.request('/website-images');
  }

  async createWebsiteImage(imageData: any) {
    return this.request('/website-images', {
      method: 'POST',
      body: JSON.stringify(imageData),
    });
  }

  async updateWebsiteImage(id: string, updateData: any) {
    return this.request(`/website-images/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteWebsiteImage(id: string) {
    return this.request(`/website-images/${id}`, {
      method: 'DELETE',
    });
  }

  // Staff Accounts API methods
  async getStaffAccounts() {
    return this.request('/staff-accounts');
  }

  async createStaffAccount(accountData: any) {
    return this.request('/staff-accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }

  async updateStaffAccount(id: string, updateData: any) {
    return this.request(`/staff-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteStaffAccount(id: string) {
    return this.request(`/staff-accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // File upload method
  async uploadFile(file: File, folder?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);

    try {
      const headers: HeadersInit = {};
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(`${this.baseURL}/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('File upload failed:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  // Search method
  async searchContent(query: string) {
    return this.request(`/search?q=${encodeURIComponent(query)}`);
  }
}

// Create and export a default instance
export const apiClient = new APIClient();

// Export the class for custom instances
export default APIClient;

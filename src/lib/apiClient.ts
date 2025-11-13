// API Client to replace Supabase integration
class APIClient {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: string | null }> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      // Get token fresh from localStorage each time
      const token = localStorage.getItem('authToken') || localStorage.getItem('auth_token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
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
      localStorage.setItem('authToken', result.data.token);
      localStorage.setItem('auth_token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
    }

    return result;
  }

  logout() {
    localStorage.removeItem('authToken');
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

  // Gallery API methods
  async getGallery() {
    const response = await this.request('/gallery');
    
    // Transform backend data (url, title, description) to frontend format (image_url, title, description)
    if (response.data && Array.isArray(response.data)) {
      response.data = response.data.map((item: any) => ({
        id: item._id || item.id,
        image_url: `http://localhost:5000${item.url}`, // Add full backend URL
        title: item.title || item.caption || 'Untitled',
        description: item.description || '',
        created_at: item.uploadedAt,
        updated_at: item.uploadedAt
      }));
    }
    
    return response;
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

  async deleteWebsiteImage(id: string) {
    return this.request(`/website-images/${id}`, {
      method: 'DELETE',
    });
  }

  // File upload method
  async uploadFile(file: File, folder?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('auth_token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
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

  // Staff API methods
  async getStaff() {
    return this.request('/staff');
  }

  async getCurrentUser() {
    return this.request('/staff/me');
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
}

// Create and export a default instance
export const apiClient = new APIClient();

// Export the class for custom instances
export default APIClient;

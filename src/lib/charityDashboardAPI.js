// API Service for Charity Dashboard Backend
// This file provides integration between React frontend and Node.js backend

const API_BASE_URL = 'http://localhost:5000/api';

class CharityDashboardAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Helper method to set auth header
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };
  }

  // Helper method for FormData requests
  getAuthHeadersForFormData() {
    return {
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };
  }

  // Authentication methods
  async login(email, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      this.token = data.token;
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    }
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  async register(email, password, role = 'staff') {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    
    if (response.ok) {
      return await response.json();
    }
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.token;
  }

  // Hero Image methods
  async getHeroImage() {
    const response = await fetch(`${this.baseURL}/hero`);
    if (response.ok) {
      return await response.json();
    }
    if (response.status === 404) {
      return null; // No hero image set
    }
    throw new Error('Failed to fetch hero image');
  }

  async uploadHeroImage(imageFile) {
    const formData = new FormData();
    formData.append('heroImage', imageFile);
    
    const response = await fetch(`${this.baseURL}/hero`, {
      method: 'POST',
      headers: this.getAuthHeadersForFormData(),
      body: formData
    });
    
    if (response.ok) {
      return await response.json();
    }
    const error = await response.json();
    throw new Error(error.message || 'Hero image upload failed');
  }

  // About Image methods
  async getAboutImage() {
    const response = await fetch(`${this.baseURL}/about`);
    if (response.ok) {
      return await response.json();
    }
    if (response.status === 404) {
      return null; // No about image set
    }
    throw new Error('Failed to fetch about image');
  }

  async uploadAboutImage(imageFile) {
    const formData = new FormData();
    formData.append('aboutImage', imageFile);
    
    const response = await fetch(`${this.baseURL}/about`, {
      method: 'POST',
      headers: this.getAuthHeadersForFormData(),
      body: formData
    });
    
    if (response.ok) {
      return await response.json();
    }
    const error = await response.json();
    throw new Error(error.message || 'About image upload failed');
  }

  async deleteAboutImage() {
    const response = await fetch(`${this.baseURL}/about`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    if (response.ok) {
      return await response.json();
    }
    const error = await response.json();
    throw new Error(error.message || 'About image deletion failed');
  }

  // News methods
  async getAllNews() {
    try {
      console.log('🔍 API: Fetching news from', `${this.baseURL}/news`);
      const response = await fetch(`${this.baseURL}/news`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      
      console.log('🔍 API: News response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API: News data received:', data?.length || 0, 'items');
        return data;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      console.error('❌ API: Failed to fetch news:', error);
      if (error.name === 'TimeoutError') {
        throw new Error('Request timeout - server may be busy');
      }
      throw new Error(error.message || 'Failed to fetch news');
    }
  }

  async getNewsById(id) {
    const response = await fetch(`${this.baseURL}/news/${id}`);
    if (response.ok) {
      return await response.json();
    }
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch news');
  }

  async createNews(title, content, category = null, imageFile = null) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (category) {
      formData.append('category', category);
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const response = await fetch(`${this.baseURL}/news`, {
      method: 'POST',
      headers: this.getAuthHeadersForFormData(),
      body: formData
    });
    
    if (response.ok) {
      return await response.json();
    }
    const error = await response.json();
    throw new Error(error.message || 'News creation failed');
  }

  async updateNews(id, title, content, imageFile = null) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const response = await fetch(`${this.baseURL}/news/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeadersForFormData(),
      body: formData
    });
    
    if (response.ok) {
      return await response.json();
    }
    const error = await response.json();
    throw new Error(error.message || 'News update failed');
  }

  async deleteNews(id) {
    try {
      console.log('🗑️ API: Deleting news with ID:', id);
      const response = await fetch(`${this.baseURL}/news/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      
      console.log('🗑️ API: Delete response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API: News deleted successfully');
        return data;
      }
      
      const error = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
      console.error('❌ API: Delete failed:', error);
      throw new Error(error.message || 'News deletion failed');
    } catch (error) {
      console.error('❌ API: Delete request error:', error);
      throw error;
    }
  }

  // Projects methods
  async getAllProjects(status = null) {
    try {
      const url = status ? `${this.baseURL}/projects?status=${status}` : `${this.baseURL}/projects`;
      console.log('🔍 API: Fetching projects from', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      
      console.log('🔍 API: Projects response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API: Projects data received:', data?.length || 0, 'items');
        return data;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      console.error('❌ API: Failed to fetch projects:', error);
      if (error.name === 'TimeoutError') {
        throw new Error('Request timeout - server may be busy');
      }
      throw new Error(error.message || 'Failed to fetch projects');
    }
  }

  async getProjectById(id) {
    const response = await fetch(`${this.baseURL}/projects/${id}`);
    if (response.ok) {
      return await response.json();
    }
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch project');
  }

  async createProject(projectData) {
    const { title_en, description_en, status, image, ...rest } = projectData;
    const formData = new FormData();
    formData.append('title', title_en || projectData.title);
    formData.append('description', description_en || projectData.description);
    formData.append('status', status || 'active');
    
    // Append any additional fields
    if (rest.category) formData.append('category', rest.category);
    if (rest.location) formData.append('location', rest.location);
    
    if (image) {
      formData.append('image', image);
    }
    
    const response = await fetch(`${this.baseURL}/projects`, {
      method: 'POST',
      headers: this.getAuthHeadersForFormData(),
      body: formData
    });
    
    if (response.ok) {
      return await response.json();
    }
    const error = await response.json();
    throw new Error(error.message || 'Project creation failed');
  }

  async updateProject(id, title, description, status, imageFile = null) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('status', status);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const response = await fetch(`${this.baseURL}/projects/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeadersForFormData(),
      body: formData
    });
    
    if (response.ok) {
      return await response.json();
    }
    const error = await response.json();
    throw new Error(error.message || 'Project update failed');
  }

  async deleteProject(id) {
    const response = await fetch(`${this.baseURL}/projects/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    if (response.ok) {
      return await response.json();
    }
    const error = await response.json();
    throw new Error(error.message || 'Project deletion failed');
  }

  // Gallery methods
  async getAllGalleryPhotos() {
    const response = await fetch(`${this.baseURL}/gallery`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch gallery photos');
  }

  async uploadGalleryPhoto(photoFile, caption = '') {
    const formData = new FormData();
    formData.append('photo', photoFile);
    formData.append('caption', caption);
    
    const response = await fetch(`${this.baseURL}/gallery`, {
      method: 'POST',
      headers: this.getAuthHeadersForFormData(),
      body: formData
    });
    
    if (response.ok) {
      return await response.json();
    }
    const error = await response.json();
    throw new Error(error.message || 'Photo upload failed');
  }

  async updatePhotoCaption(id, caption) {
    const response = await fetch(`${this.baseURL}/gallery/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ caption })
    });
    
    if (response.ok) {
      return await response.json();
    }
    const error = await response.json();
    throw new Error(error.message || 'Caption update failed');
  }

  async deletePhoto(id) {
    const response = await fetch(`${this.baseURL}/gallery/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    if (response.ok) {
      return await response.json();
    }
    const error = await response.json();
    throw new Error(error.message || 'Photo deletion failed');
  }

  // Staff/User management methods
  async getAllUsers() {
    const response = await fetch(`${this.baseURL}/auth/users`, {
      headers: this.getAuthHeaders()
    });
    
    if (response.ok) {
      return await response.json();
    }
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch users');
  }

  async verifyToken() {
    if (!this.token) return null;
    
    const response = await fetch(`${this.baseURL}/auth/verify`, {
      headers: this.getAuthHeaders()
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.user;
    }
    
    // Token is invalid, clear it
    this.logout();
    return null;
  }
}

// Create and export a singleton instance
const api = new CharityDashboardAPI();
export default api;

// Example usage in React components:
/*
import api from './charityDashboardAPI';

// In a component:
const [news, setNews] = useState([]);

useEffect(() => {
  const fetchNews = async () => {
    try {
      const newsData = await api.getAllNews();
      setNews(newsData);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    }
  };
  
  fetchNews();
}, []);

// To create news:
const handleCreateNews = async (title, content, image) => {
  try {
    const newNews = await api.createNews(title, content, image);
    setNews(prev => [newNews, ...prev]);
  } catch (error) {
    console.error('Failed to create news:', error);
  }
};
*/

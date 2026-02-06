import axios from 'axios';
import { Paper, User, ApiResponse, UploadProgress } from '../types';

// ✅ Force API URL to always end with /api (Fixes Vercel 404s)
const getApiUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'https://epaper-7o2a.onrender.com/api';
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  return url;
};

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  verifyToken: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

export const paperAPI = {
  getAll: async (): Promise<ApiResponse<Paper[]>> => {
    const response = await api.get('/papers');
    return response.data;
  },

  getByDate: async (date: string): Promise<ApiResponse<Paper>> => {
    const response = await api.get(`/papers/${date}`);
    return response.data;
  },

  getPagesByDate: async (date: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/papers/${date}/pages`);
    return response.data;
  },

  getRecent: async (days: number = 7): Promise<ApiResponse<Paper[]>> => {
    const response = await api.get(`/papers/recent/${days}`);
    return response.data;
  },

  getLatest: async (limit: number = 7): Promise<ApiResponse<Paper[]>> => {
    const response = await api.get(`/papers/latest?limit=${limit}`);
    return response.data;
  },

  upload: async (
    file: File,
    date: string,
    title: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<ApiResponse<Paper>> => {
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('date', date);
    formData.append('title', title);

    const response = await api.post('/papers/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          };
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  uploadWithThumbnail: async (
    file: File,
    date: string,
    title: string,
    thumbnail?: File,
    onProgress?: (progress: UploadProgress) => void,
    replace?: boolean
  ): Promise<ApiResponse<Paper>> => {
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('date', date);
    formData.append('title', title);
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    console.log('API Uploading:', { date, title, fileName: file.name, replace });

    const url = replace ? '/papers/upload?replace=true' : '/papers/upload';

    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          };
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/papers/${id}`);
    return response.data;
  },

  replace: async (
    id: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<ApiResponse<Paper>> => {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await api.put(`/papers/${id}/replace`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          };
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  updatePageCount: async (id: string, pageCount: number): Promise<ApiResponse<void>> => {
    const response = await api.put(`/papers/${id}/pagecount`, { pageCount });
    return response.data;
  },
};

export interface BreakingNews {
  id: number;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const breakingNewsAPI = {
  getActive: async (): Promise<ApiResponse<BreakingNews[]>> => {
    const response = await api.get('/breaking-news');
    return response.data;
  },

  update: async (content: string, is_active: boolean): Promise<ApiResponse<BreakingNews>> => {
    const response = await api.post('/breaking-news', { content, is_active });
    return response.data;
  },

  getHistory: async (): Promise<ApiResponse<BreakingNews[]>> => {
    const response = await api.get('/breaking-news/history');
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/breaking-news/${id}`);
    return response.data;
  },
};

export const contactAPI = {
  submit: async (formData: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }): Promise<ApiResponse<void>> => {
    const response = await api.post('/contact/submit', formData);
    return response.data;
  },
};

export interface Ad {
  id: number;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  created_at: string;
}

export const adsAPI = {
  getActive: async (): Promise<ApiResponse<Ad | null>> => {
    const response = await api.get('/ads/active');
    return response.data;
  },

  getAll: async (): Promise<ApiResponse<Ad[]>> => {
    const response = await api.get('/ads');
    return response.data;
  },

  create: async (file: File, link_url?: string): Promise<ApiResponse<Ad>> => {
    const formData = new FormData();
    formData.append('image', file);
    if (link_url) formData.append('link_url', link_url);

    const response = await api.post('/ads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  toggle: async (id: number): Promise<ApiResponse<Ad>> => {
    const response = await api.put(`/ads/${id}/toggle`);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/ads/${id}`);
    return response.data;
  },
};

export default api;

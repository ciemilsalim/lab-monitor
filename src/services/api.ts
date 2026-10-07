import axios from 'axios';

// URL Backend API - sesuaikan dengan setup Anda
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 detik timeout
});

// Interceptor untuk logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

// Computers API
export const computersAPI = {
  getAll: () => api.get('/api/computers'),
  getById: (id: number) => api.get(`/api/computers/${id}`),
  updateStatus: (id: number, data: any) => api.put(`/api/computers/${id}/status`, data),
};

// Students API
export const studentsAPI = {
  getAll: () => api.get('/api/students'),
  getById: (id: number) => api.get(`/api/students/${id}`),
};

// Activities API
export const activitiesAPI = {
  getAll: () => api.get('/api/activities'),
  create: (data: any) => api.post('/api/activities', data),
};

// Alerts API
export const alertsAPI = {
  getAll: () => api.get('/api/alerts'),
  create: (data: any) => api.post('/api/alerts', data),
  markAsRead: (id: number) => api.put(`/api/alerts/${id}/read`),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;

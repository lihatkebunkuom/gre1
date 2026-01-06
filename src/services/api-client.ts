import axios from 'axios';
import { APP_CONFIG } from '@/constants/config';
import { toast } from 'sonner';

// Instance Axios terpusat
export const apiClient = axios.create({
  baseURL: APP_CONFIG.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor Request (misal: attach token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor Response (Global Error Handling)
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Terjadi kesalahan pada server';
    
    // Tampilkan notifikasi error global
    toast.error(message);
    
    // Handle 401 Unauthorized (Logout otomatis)
    if (error.response?.status === 401) {
      // useAuthStore.getState().logout(); // Nanti diimplementasikan
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
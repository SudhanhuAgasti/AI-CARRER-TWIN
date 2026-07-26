/**
 * @file axiosInstance.ts
 * @description Standard Axios HTTP client instance configured with authorization headers and JWT auto-refresh interceptors.
 */

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';

// Retrieve backend API base URL from Vite environment variables (fallback to localhost:4000)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds request timeout
  withCredentials: true, // Enables transmitting secure HttpOnly cookies (like refreshToken)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to track refreshing process to prevent multiple parallel refresh loops
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | PromiseLike<string>) => void;
  reject: (reason?: any) => void;
}> = [];

// Helper to resolve/reject queue once refresh completes
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Request Interceptor: Inject JWT Token automatically
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token } = useAuthStore.getState();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const geminiKey = localStorage.getItem('gemini_api_key');
    if (geminiKey && config.headers) {
      config.headers['x-gemini-key'] = geminiKey;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: Catch expired token (401) and attempt refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If request failed with 401 (Unauthorized) and has not been retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request and wait for token refresh to finish
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { clearAuth, setAuth } = useAuthStore.getState();

      try {
        // Request new token from auth service refresh endpoint
        // withCredentials: true ensures HttpOnly cookie is sent
        const response = await axios.post<{
          accessToken: string;
          user: {
            id: string;
            name: string;
            email: string;
            role?: string;
          };
        }>(`${API_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true });

        if (response.data && response.data.accessToken) {
          const newAccessToken = response.data.accessToken;
          const user = response.data.user;

          // Update Zustand store
          setAuth(newAccessToken, user);

          processQueue(null, newAccessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          return axiosInstance(originalRequest);
        } else {
          throw new Error('Refresh token request rejected by server');
        }
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        // Wipe local auth state if refresh fails
        clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;

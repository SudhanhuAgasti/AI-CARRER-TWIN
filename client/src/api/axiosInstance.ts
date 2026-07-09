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

      const { refreshToken, clearAuth, setAuth, user } = useAuthStore.getState();

      try {
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Request new token from auth service refresh endpoint
        const response = await axios.post<{
          success: boolean;
          token: string;
          refreshToken: string;
        }>(`${API_BASE_URL}/api/auth/refresh`, { refreshToken });

        if (response.data.success && response.data.token) {
          const newToken = response.data.token;
          const newRefreshToken = response.data.refreshToken || refreshToken;

          // Update Zustand store
          if (user) {
            setAuth(newToken, newRefreshToken, user);
          }

          processQueue(null, newToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          return axiosInstance(originalRequest);
        } else {
          throw new Error('Refresh token request rejected by server');
        }
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        // Wipe local auth state and redirect to login if refresh fails
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

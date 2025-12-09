// frontend/src/api/client.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'http://localhost:3000';

// Main axios instance used by the app
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Separate instance for refresh so it is NOT intercepted
const refreshApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach access token on every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests = [];

const processQueue = (error, token = null) => {
  pendingRequests.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  pendingRequests = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    // If no response (network error, CORS, etc.), just reject
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Do NOT try refresh for login/refresh endpoints
    const isAuthLogin = originalConfig?.url === '/auth/login';
    const isAuthRefresh = originalConfig?.url === '/auth/refresh';

    if (
      status === 401 &&
      !originalConfig._retry &&
      !isAuthLogin &&
      !isAuthRefresh
    ) {
      originalConfig._retry = true;
      const authStore = useAuthStore.getState();

      if (isRefreshing) {
        // Queue other requests while refresh is in progress
        return new Promise((resolve, reject) => {
          pendingRequests.push({
            resolve: (token) => {
              if (token) {
                originalConfig.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalConfig));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        // Use refreshApi so this call is NOT re-intercepted
        const res = await refreshApi.post('/auth/refresh');
        const newToken = res.data.accessToken;

        authStore.setAccessToken(newToken);
        processQueue(null, newToken);

        originalConfig.headers.Authorization = `Bearer ${newToken}`;
        return api(originalConfig);
      } catch (err) {
        processQueue(err, null);
        authStore.logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // For login/refresh 401s and all other errors, just reject
    return Promise.reject(error);
  }
);

export default api;

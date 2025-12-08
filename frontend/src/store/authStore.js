import { create } from 'zustand';
import api from '../api/client';

export const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  setAccessToken: (token) =>
    set((state) => ({
      accessToken: token,
      isAuthenticated: !!token,
    })),

  login: async ({ username, password, pin }) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', {
        username,
        password,
        pin,
      });

      set({
        accessToken: res.data.accessToken,
        user: res.data.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return true;
    } catch (err) {
      console.error(err);
      set({
        loading: false,
        error:
          err.response?.data?.message || 'Login failed',
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
      });
    }
  },
}));

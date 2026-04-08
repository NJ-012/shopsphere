import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../api/axiosConfig';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isHydrated: false,
      loading: false,
      setUser: (user) => set({ user }),
      setHydrated: () => set({ isHydrated: true }),
      login: async (email, password) => {
        set({ loading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          set({ user: data.user, loading: false });
          return data.user;
        } catch (error) {
          set({ loading: false });
          throw new Error(error.response?.data?.error || 'Login failed');
        }
      },
      register: async (payload) => {
        set({ loading: true });
        try {
          const { data } = await api.post('/auth/register', payload);
          set({ loading: false });
          return data.user;
        } catch (error) {
          set({ loading: false });
          throw new Error(error.response?.data?.error || 'Registration failed');
        }
      },
      fetchCurrentUser: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user });
          return data.user;
        } catch {
          set({ user: null });
          return null;
        }
      },
      logout: async ({ remote = true } = {}) => {
        if (remote) {
          try {
            await api.post('/auth/logout');
          } catch {
            // Ignore logout transport failures and still clear client state.
          }
        }
        set({ user: null });
      },
    }),
    {
      name: 'shopsphere-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

export default useAuthStore;

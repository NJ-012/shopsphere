import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const pathname = window.location.pathname;
      if (pathname !== '/login' && pathname !== '/register') {
        const { default: useAuthStore } = await import('../store/authStore');
        await useAuthStore.getState().logout({ remote: false });
      }
    }

    return Promise.reject(error);
  }
);

export default api;

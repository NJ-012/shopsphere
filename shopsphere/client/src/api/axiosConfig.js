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
      try {
        const { logout } = await import('../store/authStore');
        logout();
        window.location.href = '/login';
      } catch {
        // Store not available
      }
    }
    return Promise.reject(error);
  }
);

export default api;


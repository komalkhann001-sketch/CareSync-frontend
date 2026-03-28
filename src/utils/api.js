import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});


api.interceptors.request.use((config) => {
  const user = localStorage.getItem('careSyncUser');
  if (user) {
    try {
      const { token } = JSON.parse(user);
      config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      localStorage.removeItem('careSyncUser');
    }
  }
  return config;
});

// Response interceptor to handle unauthorized access
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/book') {
        localStorage.removeItem('careSyncUser');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;

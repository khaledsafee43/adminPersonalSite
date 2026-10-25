import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', timeout: 15000 });
api.interceptors.request.use((config) => { const token = localStorage.getItem('portfolio_admin_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
api.interceptors.response.use((response) => response, (error) => { if (error.response?.status === 401 && !String(error.config?.url || '').includes('/auth/login')) { localStorage.removeItem('portfolio_admin_token'); localStorage.removeItem('portfolio_admin_user'); window.dispatchEvent(new Event('admin-session-expired')); } return Promise.reject(error); });
export const getErrorMessage = (error) => error.response?.data?.message || error.message || 'Something went wrong';
export default api;

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://portfolio-backend-bbfj.onrender.com/api';
const API = axios.create({ baseURL: API_BASE_URL });

export const toMediaUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  return new URL(path, `${new URL(API_BASE_URL).origin}/`).toString();
};

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

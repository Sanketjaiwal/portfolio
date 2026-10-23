import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API = axios.create({ baseURL: API_BASE_URL });

export const assetUrl = path => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path, new URL(API_BASE_URL, window.location.origin)).href;
};

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

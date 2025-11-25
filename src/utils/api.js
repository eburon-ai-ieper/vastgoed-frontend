import axios from 'axios';
import { getAuthHeader } from './auth';

const API_BASE_URL = 'https://vastgoed.eburon.xyz/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const authHeader = getAuthHeader();
  if (authHeader.Authorization) {
    config.headers.Authorization = authHeader.Authorization;
  }
  return config;
});

export default api;


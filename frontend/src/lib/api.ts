import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) =>
    api.post('/api/v1/user/register', userData),
  login: (credentials: { email: string; password: string }) =>
    api.post('/api/v1/auth/login', credentials),
  validate: (token: string) =>
    api.post('/api/v1/auth/validate', { token }),
};

export const chatAPI = {
  createRoom: (roomData: {
    name: string;
    description?: string;
    organisation_id: string;
    created_by_user_id: string;
    is_private?: boolean;
  }) => api.post('/api/v1/chat/rooms', roomData),
  getRooms: () => api.get('/api/v1/chat/rooms'),
  getMessages: (roomId: string) => api.get(`/api/v1/chat/rooms/${roomId}/messages`),
  sendMessage: (roomId: string, message: { message_text: string }) =>
    api.post(`/api/v1/chat/rooms/${roomId}/messages`, message),
};
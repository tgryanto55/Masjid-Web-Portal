
import axios from 'axios';
import type { Transaction, DonationInfo, ContactInfo, Event } from '../types'; 

// 1. Tentukan Alamat Backend
const API_BASE_URL = 'http://127.0.0.1:5001/api';

// 2. Buat Instance Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, 
});

// 3. Setup Otomatis Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === API SERVICES ===

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  updateProfile: async (data: { name: string; password?: string }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  }
};

export const prayerTimeService = {
  getAll: async () => {
    const response = await api.get('/prayer-times');
    return response.data;
  },
  update: async (id: string | number, time: string) => {
    const response = await api.put(`/prayer-times/${id}`, { time });
    return response.data;
  }
};

export const eventService = {
  getAll: async () => {
    const response = await api.get('/events');
    return response.data;
  },
  create: async (eventData: any) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },
  update: async (eventData: Event) => {
    const response = await api.put(`/events/${eventData.id}`, eventData);
    return response.data;
  },
  delete: async (id: string | number) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }
};

export const financeService = {
  getAll: async () => {
    const response = await api.get('/finance');
    return response.data;
  },
  create: async (data: Omit<Transaction, 'id'>) => {
    const response = await api.post('/finance', data);
    return response.data;
  },
  delete: async (id: string | number) => {
    const response = await api.delete(`/finance/${id}`);
    return response.data;
  }
};

export const donationService = {
    get: async () => {
        const response = await api.get('/donation-info');
        return response.data;
    },
    update: async (data: DonationInfo) => {
        const response = await api.put('/donation-info', data);
        return response.data;
    }
};

export const contactService = {
    get: async () => {
        const response = await api.get('/contact-info');
        return response.data;
    },
    update: async (data: ContactInfo) => {
        const response = await api.put('/contact-info', data);
        return response.data;
    }
};

export default api;

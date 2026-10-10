import axios from 'axios';
import {
  Trip,
  Activity,
  Expense,
  User,
  RouteSearchResult,
  FinancialOverview,
  Attraction,
  TransportOption,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('travelmate_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 unauthenticated status
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Do not clear token if it's already login request
      if (!error.config.url?.includes('/auth/login') && !error.config.url?.includes('/auth/register')) {
        // Optional handle logout if token expired
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (data: { name: string; email: string; password: string; role?: string }) => {
    const res = await api.post<{ success: boolean; message: string; token: string; user: User }>('/auth/register', data);
    return res.data;
  },
  login: async (data: { email: string; password: string }) => {
    const res = await api.post<{ success: boolean; message: string; token: string; user: User }>('/auth/login', data);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await api.get<{ success: boolean; user: User }>('/auth/me');
    return res.data;
  },
};

export const tripsAPI = {
  getAll: async (params?: { status?: string; search?: string; sort?: string }) => {
    const res = await api.get<{ success: boolean; count: number; data: Trip[] }>('/trips', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<{
      success: boolean;
      data: Trip & { activities: Activity[]; expenses: Expense[] };
    }>(`/trips/${id}`);
    return res.data;
  },
  create: async (data: Partial<Trip>) => {
    const res = await api.post<{ success: boolean; message: string; data: Trip }>('/trips', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Trip>) => {
    const res = await api.put<{ success: boolean; message: string; data: Trip }>(`/trips/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/trips/${id}`);
    return res.data;
  },
};

export const activitiesAPI = {
  getByTrip: async (tripId: string) => {
    const res = await api.get<{ success: boolean; count: number; data: Activity[] }>(`/trips/${tripId}/activities`);
    return res.data;
  },
  create: async (tripId: string, data: Partial<Activity>) => {
    const res = await api.post<{ success: boolean; message: string; data: Activity }>(`/trips/${tripId}/activities`, data);
    return res.data;
  },
  update: async (id: string, data: Partial<Activity>) => {
    const res = await api.put<{ success: boolean; message: string; data: Activity }>(`/activities/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/activities/${id}`);
    return res.data;
  },
};

export const expensesAPI = {
  getByTrip: async (tripId: string) => {
    const res = await api.get<{
      success: boolean;
      data: Expense[];
      summary: {
        totalBudget: number;
        totalExpenses: number;
        remainingBudget: number;
        budgetUsedPercentage: number;
        isOverBudget: boolean;
        currency: string;
        categoryTotals: Record<string, number>;
      };
    }>(`/trips/${tripId}/expenses`);
    return res.data;
  },
  create: async (tripId: string, data: Partial<Expense>) => {
    const res = await api.post<{ success: boolean; message: string; data: Expense }>(`/trips/${tripId}/expenses`, data);
    return res.data;
  },
  update: async (id: string, data: Partial<Expense>) => {
    const res = await api.put<{ success: boolean; message: string; data: Expense }>(`/expenses/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/expenses/${id}`);
    return res.data;
  },
  getOverview: async () => {
    const res = await api.get<{ success: boolean; overview: FinancialOverview }>('/expenses/overview');
    return res.data;
  },
};

export const travelAPI = {
  getRoute: async (origin: string, destination: string, travellers: number = 1) => {
    const res = await api.get<{ success: boolean; data: RouteSearchResult; meta: { note: string; isEstimated: boolean } }>('/travel/route', {
      params: { origin, destination, travellers },
    });
    return res.data;
  },
  getPlaces: async (destination: string) => {
    const res = await api.get<{ success: boolean; destination: any; attractions: Attraction[] }>('/travel/places', {
      params: { destination },
    });
    return res.data;
  },
  getTransport: async (origin: string, destination: string, travellers: number = 1) => {
    const res = await api.get<{ success: boolean; origin: any; destination: any; distanceKm: number; options: TransportOption[] }>('/travel/transport', {
      params: { origin, destination, travellers },
    });
    return res.data;
  },
};

export const adminAPI = {
  getOverview: async () => {
    const res = await api.get<{
      success: boolean;
      data: {
        totalUsers: number;
        totalTrips: number;
        totalExpensesCount: number;
        totalExpensesAmount: number;
        totalBudgetSum: number;
        databaseMode: string;
        uptime: number;
        serverTimestamp: string;
      };
    }>('/admin/overview');
    return res.data;
  },
  getUsers: async () => {
    const res = await api.get<{ success: boolean; count: number; data: any[] }>('/admin/users');
    return res.data;
  },
  getTrips: async () => {
    const res = await api.get<{ success: boolean; count: number; data: any[] }>('/admin/trips');
    return res.data;
  },
};

export default api;

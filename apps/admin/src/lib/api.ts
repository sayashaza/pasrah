import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  let token = '';
  // Check token on client side
  if (typeof window !== 'undefined') {
    if (auth.currentUser) {
      token = await auth.currentUser.getIdToken();
      localStorage.setItem('adminToken', token); // keep localStorage synced
    } else {
      token = localStorage.getItem('adminToken') || '';
    }
  }

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401 || data.message === 'Token Expired') {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          window.location.href = '/login';
        }
      }
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (err: any) {
    throw new Error(err.message || 'Network error');
  }
};

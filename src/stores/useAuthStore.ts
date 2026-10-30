import { create } from 'zustand';
import { getToken, setToken, clearToken } from '@/lib/api-client';

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  setAuth: (user: AdminUser, token: string) => void;
  logout: () => void;
  hydrate: () => void;
}

const USER_KEY = 'adqs_user';

// Hydrate synchronously so the router sees the correct auth state on first render
function getInitialAuth(): Pick<AuthState, 'user' | 'isAuthenticated'> {
  const token = getToken();
  const stored = localStorage.getItem(USER_KEY);
  if (token && stored) {
    try {
      return { user: JSON.parse(stored), isAuthenticated: true };
    } catch {
      clearToken();
      localStorage.removeItem(USER_KEY);
    }
  }
  return { user: null, isAuthenticated: false };
}

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialAuth(),

  setAuth: (user, token) => {
    setToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    clearToken();
    localStorage.removeItem(USER_KEY);
    set({ user: null, isAuthenticated: false });
  },

  hydrate: () => {}, // no-op — hydration is now synchronous at store creation
}));

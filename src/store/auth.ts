import { create } from 'zustand';
import { httpClient } from '../services/httpClient';

export type UserRole = 'admin' | 'civilian';

interface AuthState {
  isLoggedIn: boolean;
  userRole: UserRole | null;
  username: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

interface LoginResponse {
  token: string;
  username: string;
  role: UserRole;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userRole: null,
  username: null,
  token: null,

  login: async (username: string, password: string) => {
    const result = await httpClient.post<LoginResponse>('/users/login', {
      username,
      password,
    });

    set({
      isLoggedIn: true,
      userRole: result.role,
      username: result.username,
      token: result.token,
    });
  },

  logout: () => {
    set({
      isLoggedIn: false,
      userRole: null,
      username: null,
      token: null,
    });
  },

  setRole: (role: UserRole) => {
    set({ userRole: role });
  },
}));


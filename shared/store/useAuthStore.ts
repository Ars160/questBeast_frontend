import { create } from 'zustand';

type AuthState = {
  token: string | null;
  user: any | null;
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  logout: () => void; // добавляем выход
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token'); // чистим токен из localStorage
    set({ token: null, user: null }); // очищаем состояние
  },
}));

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

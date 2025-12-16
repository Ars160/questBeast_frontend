import { create } from 'zustand';

type AuthState = {
  token: string | null;
  user: any | null;
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  logout: () => void;
  hydrate: () => void; // ✅ Добавляем!
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  setToken: (token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(get().user)); // ✅ Сохраняем user тоже
    set({ token });
  },
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user)); // ✅ Сохраняем в localStorage
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // ✅ Чистим user тоже
    set({ token: null, user: null });
  },
  // ✅ Гидратация — восстанавливает из localStorage
  hydrate: () => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');
    
    if (token) {
      set({ 
        token, 
        user: userRaw ? JSON.parse(userRaw) : null 
      });
    }
  },
}));

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

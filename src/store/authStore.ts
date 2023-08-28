import { createWithEqualityFn } from 'zustand/traditional';

interface AuthStore {
  id?: string;
  setId: (id: string) => void;

  userName?: string;
  setUserName: (userName: string) => void;

  isLogin: boolean;
  setIsLogin: (isSingin: boolean) => void;
}

export const useAuthStore = createWithEqualityFn<AuthStore>(
  (set) => ({
    setId: (id) => set({ id }),
    setUserName: (userName) => set({ userName }),
    isLogin: false,
    setIsLogin: (isLogin) => set({ isLogin }),
  }),
  Object.is,
);

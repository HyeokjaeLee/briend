import { createWithEqualityFn as create } from 'zustand/traditional';

interface GlobalStore {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

import { createStore } from "zustand/vanilla";
import { useStore } from "zustand/react";

// 앱 상태 인터페이스
interface AppReadyState {
  isAppReady: boolean;
  isWebViewLoaded: boolean;
  setIsAppReady: (isReady: boolean) => void;
  setIsWebViewLoaded: (isLoaded: boolean) => void;
}

// 앱 상태 관리를 위한 스토어 생성
const appReadyStore = createStore<AppReadyState>((set) => ({
  isAppReady: false,
  isWebViewLoaded: false,
  setIsAppReady: (isReady: boolean) => set({ isAppReady: isReady }),
  setIsWebViewLoaded: (isLoaded: boolean) => set({ isWebViewLoaded: isLoaded }),
}));

// 앱 상태를 사용하기 위한 훅 생성
const useAppReadyStore = () => useStore(appReadyStore);

// 앱 상태 관련 커스텀 훅
export const AppState = {
  useAppReadyState: () => {
    const state = useAppReadyStore();
    return {
      isAppReady: state.isAppReady,
      isWebViewLoaded: state.isWebViewLoaded,
      setIsAppReady: state.setIsAppReady,
      setIsWebViewLoaded: state.setIsWebViewLoaded,
    };
  },
};

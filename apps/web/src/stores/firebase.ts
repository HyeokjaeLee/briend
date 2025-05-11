import { create } from 'zustand';

import type { UserRealtimeData } from '@/database/firebase/type';

interface FirebaseStore {
  realtimeChattingData: {
    isLoading: boolean;
    data: UserRealtimeData['chat'];
  };

  setRealtimeChattingData: (
    realtimeChattingData: FirebaseStore['realtimeChattingData'],
  ) => void;
}

export const useFirebaseStore = create<FirebaseStore>((set) => {
  return {
    realtimeChattingData: {
      isLoading: true,
      data: {},
    },

    setRealtimeChattingData: (realtimeChattingData) =>
      set({
        realtimeChattingData,
      }),
  };
});

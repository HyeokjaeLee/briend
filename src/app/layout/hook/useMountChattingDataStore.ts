import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { useAuthStore } from '@/store/useAuthStore';
import { useChattingDataStore } from '@/store/useChattingDataStore';

export const RETRY_INTERVAL = 3_000;

export const useMountChattingDataStore = () => {
  const [userId, isBinded] = useAuthStore(
    (state) => [state.userId, state.isBinded],
    shallow,
  );

  const mountDB = useChattingDataStore((state) => state.mountDB);

  useEffect(() => {
    if (isBinded) mountDB(userId);
  }, [mountDB, userId, isBinded]);
};

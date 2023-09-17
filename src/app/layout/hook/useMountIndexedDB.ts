import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { useAuthStore } from '@/store/useAuthStore';
import { useChattingRoomIndexDBStore } from '@/store/useChattingRoomIndexDBStore';

export const RETRY_INTERVAL = 3_000;

export const useMountChattingRoomIndexDBStore = () => {
  const [userId, isBinded] = useAuthStore(
    (state) => [state.userId, state.isBinded],
    shallow,
  );

  const [mountDB, isMounted] = useChattingRoomIndexDBStore(
    (state) => [state.mountDB, state.isMounted],
    shallow,
  );

  useEffect(() => {
    if (isBinded && !isMounted) {
      mountDB(userId);

      const retryInterval = setInterval(() => mountDB(userId), RETRY_INTERVAL);

      return () => {
        clearInterval(retryInterval);
      };
    }
  }, [mountDB, userId, isBinded, isMounted]);
};

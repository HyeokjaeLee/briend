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

  const mountDB = useChattingRoomIndexDBStore((state) => state.mountDB);

  useEffect(() => {
    if (isBinded) mountDB(userId);
  }, [mountDB, userId, isBinded]);
};

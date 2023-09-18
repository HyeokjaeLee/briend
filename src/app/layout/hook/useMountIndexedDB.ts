import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { useAuthStore } from '@/store/useAuthStore';
import { useChattingRoomStore } from '@/store/useChattingRoomStore';

export const RETRY_INTERVAL = 3_000;

export const RETRY_INTERVAL = 3_000;

export const useMountChattingRoomIndexDBStore = () => {
  const [userId, isBinded] = useAuthStore(
    (state) => [state.userId, state.isBinded],
    shallow,
  );

  const mountDB = useChattingRoomStore((state) => state.mountDB);

  useEffect(() => {
    if (isBinded) mountDB(userId);
  }, [mountDB, userId, isBinded]);
};

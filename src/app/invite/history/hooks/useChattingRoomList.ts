import { shallow } from 'zustand/shallow';

import { useAuthStore } from '@/store/useAuthStore';

export const useChattingRoomList = () => {
  const [chattingRoomMap] = useAuthStore(
    (state) => [state.chattingRoomMap],
    shallow,
  );

  chattingRoomMap.entries;
};

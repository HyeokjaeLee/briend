import { shallow } from 'zustand/shallow';

import { useAuthStore } from '@/store/useAuthStore';
import { useChattingRoomStore } from '@/store/useChattingRoomStore';
import { Message } from '@/types';

export const useSendMessage = () => {
  const chattingRoomInfo = useChattingRoomStore((state) => state.info);

  const sendMessage = (message: string) => {
    if (!chattingRoom) throw new Error('채팅방 정보가 없습니다.');

    const message = {
      meta: {
        ...messageMeta,
        createdAt: new Date(),
      },
    };
  };
};

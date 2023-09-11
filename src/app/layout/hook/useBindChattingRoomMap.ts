import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { useAuthStore } from '@/store/useAuthStore';
import { ChattingRoom } from '@/types';
import { decodeChattingRoomToken, isServerSide } from '@/utils';
import { naming } from '@/utils/naming';

export const useBindChattingRoomMap = () => {
  const [userId, setChattingRoomMap] = useAuthStore(
    (state) => [state.userId, state.setChattingRoomMap],
    shallow,
  );

  useEffect(() => {
    if (isServerSide() || !userId) return;

    const chattingRoomTokenList: string[] = JSON.parse(
      localStorage.getItem(naming.chattingTokenList(userId)) ?? '[]',
    );

    const chattingRoomList: [string, ChattingRoom][] = [];

    chattingRoomTokenList.forEach((token) => {
      const chattingRoom = decodeChattingRoomToken(token);

      if (chattingRoom) chattingRoomList.push([token, chattingRoom]);
    });

    setChattingRoomMap(new Map(chattingRoomList));
  }, [setChattingRoomMap, userId]);
};

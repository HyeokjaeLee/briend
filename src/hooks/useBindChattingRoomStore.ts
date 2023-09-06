import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { LOCAL_STORAGE } from '@/constants';
import { useChattingRoomStore } from '@/hooks/useChattingRoomStore';
import type { ChattingRoom } from '@/hooks/useChattingRoomStore';
import { decodeChattingRoomToken, isServerSide } from '@/utils';

export const useBindChattingRoomStore = () => {
  const [setChattingRoomMap, setChattingRoom] = useChattingRoomStore(
    (state) => [state.setChattingRoomMap, state.setChattingRoom],
    shallow,
  );

  useEffect(() => {
    if (isServerSide()) return;

    const chattingRoomTokenList: string[] = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE.CHATTING_ROOM_TOKEN_LIST) ?? '[]',
    );

    const chattingRoomList: [string, ChattingRoom][] = [];

    chattingRoomTokenList.forEach((token) => {
      const chattingRoom = decodeChattingRoomToken(token);

      if (chattingRoom) chattingRoomList.push([token, chattingRoom]);
    });

    const lastChattingRoomIndex = chattingRoomList.length - 1;

    if (lastChattingRoomIndex >= 0) {
      const [token] = chattingRoomList[lastChattingRoomIndex];

      setChattingRoom(token);
    }

    const chattingRoomMap = new Map(chattingRoomList);

    setChattingRoomMap(chattingRoomMap);
  }, [setChattingRoomMap, setChattingRoom]);
};

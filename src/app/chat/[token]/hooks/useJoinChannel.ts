import axios from 'axios';
import { shallow } from 'zustand/shallow';

import { useEffect, useMemo } from 'react';

import { useAuthStore } from '@/store/useAuthStore';
import { useChattingRoomStore } from '@/store/useChattingRoomStore';
import { decodeChattingRoomToken } from '@/utils';

export const useJoinChannel = (token: string) => {
  const [userId, isBinded] = useAuthStore(
    (state) => [state.userId, state.isBinded],
    shallow,
  );

  const [setChannel, setChattingRoom, setMessageList] = useChattingRoomStore(
    (state) => [state.setChannel, state.setChattingRoom, state.setMessageList],
    shallow,
  );

  const decodedChattingRoomToken = useMemo(
    () => decodeChattingRoomToken(token),
    [token],
  );

  if (!decodedChattingRoomToken) throw new Error('잘못된 채팅 토큰입니다.');

  const { hostId, guestName } = decodedChattingRoomToken;

  useEffect(() => {
    // hostId !== userId
    if (isBinded && hostId && guestName) {
      (async () => {
        const { status } = await axios.post(`${token}/api/join`);

        setChattingRoom(decodedChattingRoomToken);
      })();
    }
  }, [
    decodedChattingRoomToken,
    guestName,
    hostId,
    isBinded,
    setChattingRoom,
    token,
  ]);

  return decodeChattingRoomToken;
};

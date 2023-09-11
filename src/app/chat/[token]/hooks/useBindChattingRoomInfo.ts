import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { LANGUAGE } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useChattingRoomStore } from '@/store/useChattingRoomStore';
import { useGlobalStore } from '@/store/useGlobalStore';
import { decodeChattingRoomToken } from '@/utils';
import { naming } from '@/utils/naming';

export const useBindChattingRoomInfo = (token: string) => {
  const setInfo = useChattingRoomStore((state) => state.setInfo);
  const [userId, setChattingRoomMap] = useAuthStore(
    (state) => [state.userId, state.setChattingRoomMap],
    shallow,
  );
  const pusher = useGlobalStore((state) => state.pusher);

  useEffect(() => {
    if (!pusher) return;
    const decodedChattingRoomToken = decodeChattingRoomToken(token);

    if (!decodedChattingRoomToken) throw new Error('잘못된 채팅 토큰입니다.');

    const { hostId, endAt, startAt, guestLanguage, guestName, hostName } =
      decodedChattingRoomToken;

    const isHost = hostId === userId;

    const channel = pusher.subscribe(naming.chattingChannel(hostId, guestName));

    setInfo({
      channel,
      token,
      userName: isHost ? hostName : guestName,
      userLanguage: isHost ? LANGUAGE.KOREAN : guestLanguage,
      opponentName: isHost ? guestName : hostName,
      opponentLanguage: isHost ? guestLanguage : LANGUAGE.KOREAN,
      isHost,
      endAt,
      startAt,
    });

    setChattingRoomMap((prevMap) => {
      const newMap = new Map(prevMap);

      newMap.delete(token);
      newMap.set(token);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();

      setInfo(null);
    };
  }, [setInfo, token, userId, pusher, setChattingRoomMap]);
};

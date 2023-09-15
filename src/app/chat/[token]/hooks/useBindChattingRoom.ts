import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { LANGUAGE } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useChattingRoomIndexDBStore } from '@/store/useChattingRoomIndexDBStore';
import { useGlobalStore } from '@/store/useGlobalStore';
import { decodeChattingRoomToken } from '@/utils';
import { naming } from '@/utils/naming';

export const useBindChattingRoom = (token: string) => {
  const [chattingRoomList, setChattingRoom, createChattingRoom] =
    useChattingRoomIndexDBStore(
      (state) => [
        state.chattingRoomList,
        state.setChattingRoom,
        state.createChattingRoom,
      ],
      shallow,
    );

  const pusher = useGlobalStore((state) => state.pusher);

  const userId = useAuthStore((state) => state.userId);

  useEffect(() => {
    if (chattingRoomList && pusher) {
      const decodedChattingRoomToken = decodeChattingRoomToken(token);

      if (!decodedChattingRoomToken) throw new Error('잘못된 채팅 토큰입니다.');
      const { hostId, guestName } = decodedChattingRoomToken;

      const channel = pusher.subscribe(
        naming.chattingChannel(hostId, guestName),
      );

      const isAreadyExist = chattingRoomList.some(
        (chattingRoom) => chattingRoom.token === token,
      );

      if (isAreadyExist) {
        setChattingRoom({
          token,
          channel,
        });

        return () => {
          channel.unbind_all();
          channel.unsubscribe();
          setChattingRoom(null);
        };
      }

      const { guestLanguage, hostName, iat, exp } = decodedChattingRoomToken;
      const isHost = userId === hostId;

      createChattingRoom({
        token,
        isHost,
        userName: isHost ? hostName : guestName,
        userLanguage: isHost ? LANGUAGE.KOREAN : guestLanguage,
        opponentName: isHost ? guestName : hostName,
        opponentLanguage: isHost ? guestLanguage : LANGUAGE.KOREAN,
        startAt: new Date(iat * 1000),
        endAt: new Date(exp * 1000),
      });
    }
  }, [
    chattingRoomList,
    createChattingRoom,
    pusher,
    setChattingRoom,
    token,
    userId,
  ]);
};

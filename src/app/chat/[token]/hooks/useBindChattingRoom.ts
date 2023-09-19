import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { LANGUAGE } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useChattingDataStore } from '@/store/useChattingDataStore';
import { useGlobalStore } from '@/store/useGlobalStore';
import { decodeChattingRoomToken } from '@/utils';
import { naming } from '@/utils/naming';

export const useBindChattingRoom = (token: string) => {
  const [isMounted, chattingRoomList, setChattingRoom, createChattingRoom] =
    useChattingDataStore(
      (state) => [
        state.isMounted,
        state.chattingRoomList,
        state.setChattingRoom,
        state.createChattingRoom,
      ],
      shallow,
    );

  const pusher = useGlobalStore((state) => state.pusher);

  const userId = useAuthStore((state) => state.userId);

  useEffect(() => {
    if (chattingRoomList && pusher && isMounted) {
      (async () => {
        const decodedChattingRoomToken = decodeChattingRoomToken(token);

        if (!decodedChattingRoomToken)
          throw new Error('잘못된 채팅 토큰입니다.');
        const { hostId, guestName } = decodedChattingRoomToken;

        const channel = pusher.subscribe(
          naming.chattingChannel(hostId, guestName),
        );

        const isAreadyExist = chattingRoomList.some(
          (chattingRoom) => chattingRoom.token === token,
        );

        const isHost = userId === hostId;

        if (!isAreadyExist) {
          const { guestLanguage, hostName, iat, exp } =
            decodedChattingRoomToken;

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
        } else {
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
      })();
    }
  }, [
    isMounted,
    chattingRoomList,
    createChattingRoom,
    pusher,
    setChattingRoom,
    token,
    userId,
  ]);
};

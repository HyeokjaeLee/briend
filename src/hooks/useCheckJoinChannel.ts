import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { CHANNEL_EVENT } from '@/constants';
import { decodeChattingRoomToken } from '@/utils';

import { useChattingRoomStore } from '../store/useChattingRoomStore';

interface UseCheckJoinChannelParams {
  onJoinChannel?: () => void;
}

export const useCheckJoinChannel = ({
  onJoinChannel,
}: UseCheckJoinChannelParams) => {
  const [chattingRoomMap, setChattingRoomMap, setChattingRoom] =
    useChattingRoomStore(
      (state) => [
        state.chattingRoomMap,
        state.setChattingRoomMap,
        state.setChattingRoom,
      ],
      shallow,
    );

  useEffect(() => {
    if (channel) {
      channel.bind(CHANNEL_EVENT.JOIN_CHANNEL, (token: string) => {
        const chattingRoom = decodeChattingRoomToken(token);
        if (chattingRoom) {
          chattingRoomMap.set(token, chattingRoom);
          setChattingRoom(token);
          setChattingRoomMap(chattingRoomMap);
        }
      });

      return () => {
        channel.unbind(CHANNEL_EVENT.JOIN_CHANNEL);
      };
    }
  });
};

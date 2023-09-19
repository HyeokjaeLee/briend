import axios from 'axios';

import { useEffect } from 'react';

import { CHANNEL_EVENT, LANGUAGE_PACK } from '@/constants';
import { useChattingDataStore } from '@/store/useChattingDataStore';
import { useToast } from '@hyeokjaelee/pastime-ui';

import { JoinPostParams, JoinPusherResponse } from '../api/join/route';

export const useJoinChannel = () => {
  const chattingRoom = useChattingDataStore((state) => state.chattingRoom);

  const { toast } = useToast();

  useEffect(() => {
    if (chattingRoom) {
      const { token, isHost, userLanguage, opponentName, channel } =
        chattingRoom;

      (async () => {
        const { status } = await axios.post(`${token}/api/join`, {
          isHost,
        } satisfies JoinPostParams);

        if (!isHost) {
          switch (status) {
            case 401: {
              return toast({
                type: 'warning',
                message:
                  LANGUAGE_PACK.JOIN_EXPIRED_CHATTING_ROOM_TOAST[userLanguage](
                    opponentName,
                  ),
              });
            }
          }
        }
      })();

      channel.bind(CHANNEL_EVENT.JOIN_CHANNEL, (data: JoinPusherResponse) => {
        if (data.isHost !== isHost) {
          toast({
            type: 'info',
            message: `${opponentName}님이 채팅을 보고 있어요!`,
          });
        }
      });

      return () => {
        channel.unbind(CHANNEL_EVENT.JOIN_CHANNEL);
      };
    }
  }, [chattingRoom, toast]);
};

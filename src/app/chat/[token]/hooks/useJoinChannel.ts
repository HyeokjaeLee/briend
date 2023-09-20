import axios from 'axios';

import { useEffect } from 'react';

import { CHANNEL_EVENT, LANGUAGE_PACK } from '@/constants';
import { useChattingDataStore } from '@/store/useChattingDataStore';
import { ApiError } from '@/types';
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
        try {
          await axios.post(`${token}/api/join`, {
            isHost,
          } satisfies JoinPostParams);
        } catch (e) {
          const { status } = (e as ApiError).response;

          switch (status) {
            case 401: {
              return toast({
                type: 'warning',
                message: isHost
                  ? '이 채팅방은 만료되었어요!\n 새로운 채팅방을 만들어주세요!'
                  : LANGUAGE_PACK.JOIN_EXPIRED_CHATTING_ROOM_TOAST[
                      userLanguage
                    ](opponentName),
              });
            }
            default:
              return toast({
                type: 'fail',
                message: String(e),
              });
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

import axios from 'axios';

import { useEffect } from 'react';

import { CHANNEL_EVENT } from '@/constants';
import { useExpiredTokenErrorToast } from '@/hooks/useExpiredTokenErrorToast';
import { useChattingDataStore } from '@/store/useChattingDataStore';
import { useToast } from '@hyeokjaelee/pastime-ui';

import { JoinPostParams, JoinPusherResponse } from '../api/join/route';

export const useJoinChannel = () => {
  const chattingRoom = useChattingDataStore((state) => state.chattingRoom);
  const { toastExpiredTokenError } = useExpiredTokenErrorToast();

  const { toast } = useToast();

  useEffect(() => {
    if (chattingRoom) {
      const { token, isHost, opponentName, channel } = chattingRoom;

      (async () => {
        try {
          await axios.post(`${token}/api/join`, {
            isHost,
          } satisfies JoinPostParams);
        } catch (e) {
          if (!toastExpiredTokenError(e)) {
            toast({
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
  }, [chattingRoom, toast, toastExpiredTokenError]);
};

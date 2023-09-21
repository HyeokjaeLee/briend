import axios from 'axios';

import { useEffect } from 'react';

import { CHANNEL_EVENT, LANGUAGE_PACK } from '@/constants';
import { useExpiredTokenErrorToast } from '@/hooks/useExpiredTokenErrorToast';
import { useChattingDataStore } from '@/store/useChattingDataStore';
import { useTempMessageStore } from '@/store/useTempMessageStore';
import { useToast } from '@hyeokjaelee/pastime-ui';

import { JoinPostParams, JoinPusherResponse } from '../api/join/route';

export const useJoinChannel = () => {
  const chattingRoom = useChattingDataStore((state) => state.chattingRoom);
  const { toastExpiredTokenError } = useExpiredTokenErrorToast();
  const setIsOpponentLooking = useTempMessageStore(
    (state) => state.setIsOpponentLooking,
  );

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
            message:
              LANGUAGE_PACK.LOOKING_CHATTING_TOAST[chattingRoom.userLanguage](
                opponentName,
              ),
          });
          setIsOpponentLooking(true);
        }
      });

      return () => {
        channel.unbind(CHANNEL_EVENT.JOIN_CHANNEL);
      };
    }
  }, [chattingRoom, toast, toastExpiredTokenError, setIsOpponentLooking]);
};

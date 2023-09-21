import { shallow } from 'zustand/shallow';

import { useCallback } from 'react';

import { LANGUAGE_PACK } from '@/constants';
import { useChattingDataStore } from '@/store/useChattingDataStore';
import { ApiError } from '@/types';
import { useToast } from '@hyeokjaelee/pastime-ui';

export const useExpiredTokenErrorToast = () => {
  const { toast } = useToast();

  const [expireChattingRoom, chattingRoom] = useChattingDataStore(
    (state) => [state.expireChattingRoom, state.chattingRoom],
    shallow,
  );

  const toastExpiredTokenError = useCallback(
    (e: unknown) => {
      if (chattingRoom) {
        const { isExpired, userLanguage, opponentName, isHost } = chattingRoom;
        const { status } = (e as ApiError).response;

        if (status === 401) {
          if (!isExpired) expireChattingRoom();

          toast({
            type: 'warning',
            message: isHost
              ? '이 채팅방은 만료되었어요!\n 새로운 채팅방을 만들어주세요!'
              : LANGUAGE_PACK.JOIN_EXPIRED_CHATTING_ROOM_TOAST[userLanguage](
                  opponentName,
                ),
          });

          return true;
        }

        return false;
      }
    },
    [toast, expireChattingRoom, chattingRoom],
  );

  return {
    toastExpiredTokenError,
  };
};

import axios from 'axios';

import { useState } from 'react';

import { LANGUAGE } from '@/constants';
import type { Message } from '@/types';

import { useChattingRoomStore } from '../store/useChattingRoomStore';

export interface UseSendMessageParams {
  from: string;
  to: string;
  language: LANGUAGE;
}

export const useSendMessage = ({
  from,
  to,
  language,
}: UseSendMessageParams) => {
  const [isLoading, setIsLoading] = useState(false);

  const chattingRoom = useChattingRoomStore((state) => state.chattingRoom);

  return {
    sendMessage: async (message: string) => {
      setIsLoading(true);

      await axios.post(`/api/chat/${chattingRoom?.hostId}/send`, {
        meta: {
          from,
          to,
          createdAt: new Date(),
        },
        message: {
          [language]: message,
        },
      } satisfies Message);

      setIsLoading(false);
    },

    isLoading,
  };
};

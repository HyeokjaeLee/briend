import axios from 'axios';
import { shallow } from 'zustand/shallow';

import { useState } from 'react';

import { LANGUAGE } from '@/constants';
import type { Message } from '@/types';

import { useChattingStore } from './useChattingStore';

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

  const [isBinded, hostId] = useChattingStore(
    (state) => [state.isBinded, state.hostId],
    shallow,
  );

  return {
    sendMessage: async (message: string) => {
      if (!isBinded) throw new Error('채팅방 정보가 바인딩이 되지 않았습니다.');
      setIsLoading(true);

      await axios.post(`/api/chat/${hostId}/send`, {
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

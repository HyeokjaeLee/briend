'use client';

import axios from 'axios';

import { useState } from 'react';

import type {
  SignChattingRoomTokenParams,
  SignChattingRoomTokenRespons,
} from '@api/chatting-room';

export const useGetChattingRoomToken = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] =
    useState<SignChattingRoomTokenRespons['token']>(null);

  return {
    getToken: async (params: SignChattingRoomTokenParams) => {
      setIsLoading(true);

      const { data } = await axios.get<SignChattingRoomTokenRespons>(
        '/api/chatting-room',
        {
          params,
        },
      );

      const { token } = data;

      setToken(token);

      return setIsLoading(false);
    },

    token,
    isLoading,
    resetToken: () => setToken(null),
  };
};

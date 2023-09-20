'use client';

import axios from 'axios';

import { useState } from 'react';

import { PATH } from '@/constants';

import type {
  SignChattingRoomTokenParams,
  SignChattingRoomTokenRespons,
} from '../api/[invite]/route';

export const useGetChattingRoomToken = () => {
  const [isLoading, setIsLoading] = useState(false);

  return {
    getChattingRoomToken: async (params: SignChattingRoomTokenParams) => {
      setIsLoading(true);

      const { data } = await axios.get<SignChattingRoomTokenRespons>(
        `${PATH.INVITE}/api/new`,
        {
          params,
        },
      );

      const { token } = data;

      setTimeout(() => setIsLoading(false), 1_000);
      return token;
    },

    isLoading,
  };
};

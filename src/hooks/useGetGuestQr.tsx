'use client';

import axios from 'axios';

import { useState } from 'react';

import type {
  GetGuestQrRequestParams,
  GetGuestQrResponse,
} from '@api/guest-token';

export const useGetGuestToken = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<GetGuestQrResponse['token']>(null);

  return {
    getGuestToken: async (params: GetGuestQrRequestParams) => {
      setIsLoading(true);

      const { data } = await axios.get<GetGuestQrResponse>('/api/guest-token', {
        params,
      });

      const { token } = data;

      setToken(token);

      return setIsLoading(false);
    },

    token,
    isLoading,
    resetToken: () => setToken(null),
  };
};

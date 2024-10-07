import type { ApiParams, ApiResponse } from '../types/api';

import ky from 'ky';

const apiInstance = ky.create({
  prefixUrl: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const API_ROUTES = {
  CREATE_CHAT: (params: ApiParams.CREATE_CHAT) =>
    apiInstance
      .get<ApiResponse.CREATE_CHAT>('chat/create', {
        searchParams: {
          ...params,
        },
      })
      .json(),
};

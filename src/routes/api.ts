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
  UNLINK_ACCOUNT: (params: ApiParams.UNLINK_ACCOUNT) =>
    apiInstance
      .post<ApiResponse.UNLINK_ACCOUNT>('auth/unlink-account', {
        json: params,
      })
      .json(),

  EDIT_PROFILE: (params: ApiParams.EDIT_PROFILE) =>
    apiInstance
      .post<ApiResponse.EDIT_PROFILE>('edit-profile', {
        json: params,
      })
      .json(),

  SEND_MESSAGE: (params: ApiParams.SEND_MESSAGE) =>
    apiInstance
      .post<ApiResponse.SEND_MESSAGE>('chat/send-message', {
        json: params,
      })
      .json(),

  RECEIVE_MESSAGE: (params: ApiParams.RECEIVE_MESSAGE) =>
    apiInstance
      .post<ApiResponse.RECEIVE_MESSAGE>('chat/receive-message', {
        json: params,
      })
      .json(),
};

import type { ApiParams, ApiResponse } from '../types/api';
import type { UserAuthResponse } from 'pusher';

import ky from 'ky';

import { PUBLIC_ENV } from '@/constants/public-env';
import type { TOKEN_TYPE } from '@/types/jwt';

const apiInstance = ky.create({
  prefixUrl: `${PUBLIC_ENV.BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const API_ROUTES = {
  CREATE_CHAT_INVITE_TOKEN: (params: ApiParams.CREATE_CHAT_INVITE_TOKEN) =>
    apiInstance
      .post<ApiResponse.CREATE_CHAT_INVITE_TOKEN>('chat/create/invite-token', {
        json: params,
      })
      .json(),

  CREATE_CHAT_CHANNEL_TOKEN: (params: ApiParams.CREATE_CHAT_CHANNEL_TOKEN) =>
    apiInstance
      .post<ApiResponse.CREATE_CHAT_CHANNEL_TOKEN>(
        'chat/create/channel-token',
        {
          json: params,
        },
      )
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
      .post('chat/send-message', {
        json: params,
      })
      .json(),

  RECEIVE_MESSAGE: (params: ApiParams.RECEIVE_MESSAGE) =>
    apiInstance
      .post<ApiResponse.RECEIVE_MESSAGE>('chat/receive-message', {
        json: params,
      })
      .json(),

  VERIFY_CHAT_TOKEN: <TTokenType extends TOKEN_TYPE>(
    params: ApiParams.VERIFY_CHAT_TOKEN<TTokenType>,
  ) =>
    apiInstance
      .get<ApiResponse.VERIFY_CHAT_TOKEN<TTokenType>>(
        `chat/verify/${params.tokenType}`,
        {
          searchParams: {
            token: params.token,
          },
        },
      )
      .json(),

  AUTHENTICATE_PUSHER: (params: ApiParams.AUTHENTICATE_PUSHER) =>
    apiInstance
      .post<UserAuthResponse>('auth/pusher', {
        json: params,
      })
      .json(),
};

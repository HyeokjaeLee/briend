import type { ApiResponse } from '../types/api-response';

import ky from 'ky';

import { PUBLIC_ENV } from '@/constants';
import type { ApiParams } from '@/types/api-params';
import type { UserSession } from '@/types/next-auth';
import { assert } from '@/utils';

const apiInstance = ky.create({
  prefixUrl: `${PUBLIC_ENV.BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 5_000,
});

export const API_ROUTES = {
  SYNC_USER_DATA: (json: ApiParams.SyncUserData) =>
    apiInstance
      .post<UserSession>('sync-user-data', {
        json,
      })
      .json(),

  LINK_ACCOUNT: (json: ApiParams.LinkAccount) =>
    apiInstance
      .post<UserSession>('link-account', {
        json,
      })
      .json(),

  CREATE_FRIEND: (params: ApiParams.CREATE_FRIEND) =>
    apiInstance
      .post<ApiResponse.CREATE_FRIEND>('chat/create/friend', {
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

  SHORT_URL: async (url: string) => {
    const params = new URLSearchParams({
      url,
    });

    const res = await ky.post<{
      short_url?: string;
    }>('https://spoo.me', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const json = await res.json();

    assert(json.short_url);

    return json.short_url;
  },
};

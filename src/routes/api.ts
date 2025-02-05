import type { ApiResponse } from '../types/api-response';

import ky from 'ky';

import { PUBLIC_ENV } from '@/constants';
import type { ApiParams } from '@/types/api-params';
import type { TOKEN_TYPE } from '@/types/jwt';
import { assert } from '@/utils';
import type {
  VerifyChatTokenApiParams,
  VerifyChatTokenApiResponse,
} from '@api/chat/verify/[tokenType]/route';

const apiInstance = ky.create({
  prefixUrl: `${PUBLIC_ENV.BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 5_000,
});

export const API_ROUTES = {
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

  VERIFY_CHAT_TOKEN: <TTokenType extends TOKEN_TYPE>(
    params: VerifyChatTokenApiParams<TTokenType>,
  ) =>
    apiInstance
      .get<VerifyChatTokenApiResponse<TTokenType>>(
        `chat/verify/${params.tokenType}`,
        {
          searchParams: {
            token: params.token,
          },
        },
      )
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

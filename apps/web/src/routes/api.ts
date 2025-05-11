import ky from 'ky';

import type { PostAccountRequest } from '@/app/api/account/route';
import type { GetFirebaseCustomTokenResponse } from '@/app/api/firebase-custom-token/route';
import type {
  PostUserDataRequest,
  PostUserDataResponse,
} from '@/app/api/user-data/route';
import { PUBLIC_ENV } from '@/constants';
import type { UserSession } from '@/types/next-auth';

const apiInstance = ky.create({
  prefixUrl: `${PUBLIC_ENV.BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 5_000,
});

export const API_ROUTES = {
  POST_USER_DATA: (json: PostUserDataRequest) =>
    apiInstance.post<PostUserDataResponse>('user-data', {
      json,
    }),
  POST_ACCOUNT: (json: PostAccountRequest) =>
    apiInstance.post<UserSession>('account', {
      json,
    }),
  POST_SHORT_URL: (url: string) => {
    const params = new URLSearchParams({
      url,
    });

    return ky.post<{
      short_url?: string;
    }>('https://spoo.me', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
  },

  GET_ACCOUNT_RANDOM_IMAGE_URL: (userId: string) =>
    `/api/account/random-image?userId=${userId}`,

  GET_FIREBASE_CUSTOM_TOKEN: () =>
    apiInstance.get<GetFirebaseCustomTokenResponse>('firebase-custom-token'),
};

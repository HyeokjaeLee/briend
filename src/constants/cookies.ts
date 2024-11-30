import type { LOGIN_PROVIDERS } from './etc';
import type { LANGUAGE } from './language';
import type { CookieSetOptions } from 'universal-cookie';

import { IS_DEV } from './public-env';

export enum COOKIES {
  I18N = 'I18N',
  USER_ID = 'USER_ID',
  PRIVATE_REFERER = 'PRIVATE_REFERER',
  PROVIDER_TO_CONNECT = 'PROVIDER_TO_CONNECT',
}

export interface COOKIES_VALUE {
  I18N: LANGUAGE;
  USER_ID: string;
  PRIVATE_REFERER: string;
  PROVIDER_TO_CONNECT: LOGIN_PROVIDERS;
}

export type COOKIES_KEY_TYPE = keyof typeof COOKIES;

export const DEFAULT_COOKIES_OPTIONS: CookieSetOptions = {
  httpOnly: !IS_DEV,
  secure: !IS_DEV,
  path: '/',
};

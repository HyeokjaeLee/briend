import type { LOGIN_PROVIDERS } from './etc';
import type { LANGUAGE } from './language';
import type { CookieSetOptions } from 'universal-cookie';

import { IS_DEV } from './public-env';

export enum COOKIES {
  I18N = 'i18n',
  USER_ID = 'userId',
  PRIVATE_REFERER = 'privateReferrer',
  PROVIDER_TO_CONNECT = 'providerToConnect',
  FIREBASE_ID_TOKEN = 'firebaseIdToken',
}

export interface COOKIES_VALUE {
  [COOKIES.I18N]: LANGUAGE;
  [COOKIES.USER_ID]: string;
  [COOKIES.PRIVATE_REFERER]: string;
  [COOKIES.PROVIDER_TO_CONNECT]: LOGIN_PROVIDERS;
  [COOKIES.FIREBASE_ID_TOKEN]: string;
}

export type COOKIES_KEY_TYPE = keyof typeof COOKIES;

export const DEFAULT_COOKIES_OPTIONS: CookieSetOptions = {
  httpOnly: false,
  secure: !IS_DEV,
  path: '/',
};

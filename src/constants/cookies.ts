import type { LOGIN_PROVIDERS } from './etc';
import type { LANGUAGE } from './language';
import type { CookieSetOptions } from 'universal-cookie';

import { IS_DEV } from './public-env';

export enum COOKIES {
  I18N = 'i18n',
  USER_ID = 'userId',
  ANONYMOUS_ID = 'anonymousId',
  PRIVATE_REFERER = 'privateReferrer',
  FIREBASE_ID_TOKEN = 'firebaseIdToken',
  LINK_ACCOUNT_TOKEN = 'linkAccountToken',
  LINKED_PROVIDER = 'linkedProvider',
}

export interface COOKIES_VALUE {
  [COOKIES.I18N]: LANGUAGE;
  [COOKIES.USER_ID]: string;
  [COOKIES.ANONYMOUS_ID]: string;
  [COOKIES.PRIVATE_REFERER]: string;
  [COOKIES.FIREBASE_ID_TOKEN]: string;
  [COOKIES.LINK_ACCOUNT_TOKEN]: string;
  [COOKIES.LINKED_PROVIDER]: LOGIN_PROVIDERS;
}

export type COOKIES_KEY_TYPE = keyof typeof COOKIES;

export const DEFAULT_COOKIES_OPTIONS: CookieSetOptions = {
  httpOnly: false,
  secure: !IS_DEV,
  path: '/',
  sameSite: 'lax',
};

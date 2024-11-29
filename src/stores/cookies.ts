import type { CookieGetOptions, CookieSetOptions } from 'universal-cookie';

import { Cookies } from 'react-cookie';

import type { LOGIN_PROVIDERS } from '@/constants/etc';
import type { LANGUAGE } from '@/constants/language';
import { IS_DEV } from '@/constants/public-env';

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

export class CustomCookies extends Cookies {
  get<TKey extends COOKIES_KEY_TYPE>(key: TKey, options?: CookieGetOptions) {
    const value: COOKIES_VALUE[TKey] = super.get(COOKIES[key], options);

    return value;
  }
  set<TKey extends COOKIES_KEY_TYPE>(
    key: TKey,
    value: COOKIES_VALUE[TKey],
    options?: CookieSetOptions,
  ) {
    super.set(COOKIES[key], value, options);
  }
  getAll(options?: CookieGetOptions): {
    [key in COOKIES_KEY_TYPE]: COOKIES_VALUE[key];
  } {
    return super.getAll(options);
  }
  remove(key: COOKIES_KEY_TYPE, options?: CookieSetOptions) {
    super.remove(COOKIES[key], options);
  }
}

export const cookies = new CustomCookies();

export const DEFAULT_COOKIES_OPTIONS: CookieSetOptions = {
  httpOnly: !IS_DEV,
  secure: !IS_DEV,
  path: '/',
};

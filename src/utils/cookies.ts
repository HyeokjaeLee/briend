'use client';

import type { CookieGetOptions, CookieSetOptions } from 'universal-cookie';

import { Cookies } from 'react-cookie';

import {
  COOKIES,
  type COOKIES_KEY_TYPE,
  type COOKIES_VALUE,
} from '@/constants';

class CustomCookies extends Cookies {
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

export const customCookies = new CustomCookies();

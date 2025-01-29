import type { CookieGetOptions, CookieSetOptions } from 'universal-cookie';

import { Cookies } from 'react-cookie';

import {
  COOKIES,
  type COOKIES_KEY_TYPE,
  type COOKIES_VALUE,
} from '@/constants';

class CustomCookies extends Cookies {
  get<TKey extends COOKIES>(key: TKey, options?: CookieGetOptions) {
    const value: COOKIES_VALUE[TKey] | undefined = super.get(key, options);

    return value;
  }

  async server() {
    const nextCookies = await import('next/headers').then((res) =>
      res.cookies(),
    );

    const get = <TKey extends COOKIES>(key: TKey) => {
      const value = nextCookies.get(key)?.value as
        | COOKIES_VALUE[TKey]
        | undefined;

      return value;
    };

    const set = <TKey extends COOKIES>(
      key: TKey,
      value: COOKIES_VALUE[TKey],
      options?: CookieSetOptions,
    ) => {
      nextCookies.set(key, value, options);
    };

    const remove = <TKey extends COOKIES>(key: TKey) => {
      nextCookies.delete(COOKIES[key]);
    };

    return { get, set, remove };
  }

  set<TKey extends COOKIES>(
    key: TKey,
    value: COOKIES_VALUE[TKey],
    options?: CookieSetOptions,
  ) {
    super.set(key, value, options);
  }

  getAll(options?: CookieGetOptions): {
    [key in COOKIES]: COOKIES_VALUE[key];
  } {
    return super.getAll(options);
  }
  remove(key: COOKIES, options?: CookieSetOptions) {
    super.remove(key, options);
  }
}

export const customCookies = new CustomCookies();

export type ServerCookies = Awaited<ReturnType<typeof customCookies.server>>;

import type { CookieGetOptions, CookieSetOptions } from 'universal-cookie';
import Cookies from 'universal-cookie';

import {
  type COOKIES,
  type COOKIES_VALUE,
  DEFAULT_COOKIES_OPTIONS,
} from '@/constants';

class CustomCookies extends Cookies {
  get<TKey extends COOKIES>(key: TKey, options?: CookieGetOptions) {
    const value: COOKIES_VALUE[TKey] | undefined = super.get(key, {
      ...DEFAULT_COOKIES_OPTIONS,
      ...options,
    });

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
      nextCookies.set(key, value, {
        ...DEFAULT_COOKIES_OPTIONS,
        ...options,
      });
    };

    const remove = <TKey extends COOKIES>(key: TKey) => {
      nextCookies.delete(key);
    };

    return { get, set, remove, getAll: nextCookies.getAll };
  }

  set<TKey extends COOKIES>(
    key: TKey,
    value: COOKIES_VALUE[TKey],
    options?: CookieSetOptions,
  ) {
    super.set(key, value, {
      ...DEFAULT_COOKIES_OPTIONS,
      ...options,
    });
  }

  getAll(options?: CookieGetOptions): {
    [key in COOKIES]: COOKIES_VALUE[key];
  } {
    return super.getAll({
      ...DEFAULT_COOKIES_OPTIONS,
      ...options,
    });
  }
  remove(key: COOKIES, options?: CookieSetOptions) {
    super.remove(key, {
      ...DEFAULT_COOKIES_OPTIONS,
      ...options,
    });
  }
}

export const customCookies = new CustomCookies();

export type ServerCookies = Awaited<ReturnType<typeof customCookies.server>>;

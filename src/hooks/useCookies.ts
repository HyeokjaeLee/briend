import type { CookieSetOptions, CookieGetOptions } from 'universal-cookie';

import { useCookies as useReactCookies } from 'react-cookie';

import type { COOKIES, COOKIES_VALUE } from '@/constants';

export const useCookies = <
  T extends COOKIES,
  U = { [K in T]?: COOKIES_VALUE[K] },
>(
  deps: T[],
  options?: CookieGetOptions,
) =>
  useReactCookies(deps, options) as [
    U,
    (name: T, value: COOKIES_VALUE[T], options?: CookieSetOptions) => void,
    (name: T, options?: CookieSetOptions) => void,
    () => void,
  ];

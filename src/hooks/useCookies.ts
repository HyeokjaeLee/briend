import { useCookies as useReactCookies } from 'react-cookie';

import type { COOKIES, COOKIES_VALUE } from '@/constants/cookies';

interface CookieSetOptions {
  doNotParse?: boolean;
  doNotUpdate?: boolean;
}

export const useCookies = <
  T extends keyof typeof COOKIES,
  U = { [K in T]?: COOKIES_VALUE[K] },
>(
  deps: T[],
  options?: CookieSetOptions,
) =>
  useReactCookies(deps, options) as [
    U,
    (name: T, value: U, options?: CookieSetOptions) => void,
    (name: T, options?: CookieSetOptions) => void,
    () => void,
  ];

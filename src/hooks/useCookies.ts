import { useCookies as useReactCookies } from 'react-cookie';

import type {
  COOKIES,
  COOKIES_KEY_TYPE,
  COOKIES_VALUE,
} from '@/constants/cookies';

export const useCookies = useReactCookies<
  COOKIES,
  {
    [key in COOKIES_KEY_TYPE]: COOKIES_VALUE[key];
  }
>;

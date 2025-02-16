export enum LOGIN_PROVIDERS {
  GOOGLE = 'google',
  NAVER = 'naver',
  KAKAO = 'kakao',
}

export const IS_CLIENT = typeof window !== 'undefined';

export const IS_TOUCH_DEVICE =
  IS_CLIENT && ('ontouchstart' in window || 0 < navigator.maxTouchPoints);

export enum QUERY_KEYS {
  NOT_SESSION = 'not-save-to-session',
}

export const PEER_PREFIX = 'briend_';
export const MAX_FIREND_COUNT = 10;

export enum HEADERS {
  PURE_PATH = 'pure-path',
}

export enum PATH {
  TRPC = '/api/trpc',
}

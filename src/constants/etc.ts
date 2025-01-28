export enum LOGIN_PROVIDERS {
  GOOGLE = 'google',
  NAVER = 'naver',
  KAKAO = 'kakao',
}

export const IS_CLIENT = typeof window !== 'undefined';

export enum QUERY_KEYS {
  SESSION = 'saved-session-storage',
}

export const PEER_PREFIX = 'briend_';
export const MAX_FIREND_COUNT = 10;

export enum HEADERS {
  PURE_PATH = 'pure-path',
}

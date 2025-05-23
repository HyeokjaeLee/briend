export enum LOGIN_PROVIDERS {
  GOOGLE = 'google',
  NAVER = 'naver',
  KAKAO = 'kakao',
}

export const IS_CLIENT = typeof window !== 'undefined';

export enum QUERY_KEYS {}

export const PEER_PREFIX = 'briend_';

export enum HEADERS {
  PURE_PATH = 'pure-path',
}

export enum PATH {
  TRPC = '/api/trpc',
}

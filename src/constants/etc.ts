export enum LOGIN_PROVIDERS {
  GOOGLE = 'google',
  NAVER = 'naver',
  KAKAO = 'kakao',
}

export const IS_CLIENT = typeof window !== 'undefined';

export enum QUERY_KEYS {
  SESSION = 'saved-session-storage',
}

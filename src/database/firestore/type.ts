import type { LANGUAGE } from '@/constants';

export namespace Firestore {
  export interface ProviderAccount {
    userId: string;
  }

  export interface UserInfo {
    googleId?: string;
    naverId?: string;
    kakaoId?: string;
    language: LANGUAGE;
  }
}

export enum COLLECTIONS {
  PROVIDER_ACCOUNTS = 'providerAccounts',
  USERS = 'users',
  CHATTING_ROOMS = 'chattingRooms',
}

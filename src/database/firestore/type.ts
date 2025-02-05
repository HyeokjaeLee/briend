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

  /**
   * @description docId는 상대방 Id, type은 본인의 타입
   */
  export type ChattingRoom =
    | {
        type: 'host';
        /**
         * @description guest가 anonymous 계정인 경우 nickname을 저장함
         */
        nickname?: string;
        roomId: string;
        messages?: any[];
      }
    | {
        type: 'guest';
      };
}

export enum COLLECTIONS {
  PROVIDER_ACCOUNTS = 'providerAccounts',
  USERS = 'users',
  CHATTING_ROOMS = 'chattingRooms',
}

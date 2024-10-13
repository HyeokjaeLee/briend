import type { LOGIN_PROVIDERS } from '@/constants/etc';
import type { LANGUAGE } from '@/constants/language';

export namespace ApiParams {
  export interface CREATE_CHAT {
    userId: string;
    language: LANGUAGE;
    nickname: string;
    emoji: string;
  }

  export interface UNLINK_ACCOUNT {
    provider: LOGIN_PROVIDERS;
  }
}

export namespace ApiResponse {
  export interface CREATE_CHAT {
    inviteToken: string;
  }

  export interface UNLINK_ACCOUNT {
    unlinkedProvider: LOGIN_PROVIDERS;
  }
}

export namespace PusherType {
  export interface joinChat {
    channelToken: string;
  }
}

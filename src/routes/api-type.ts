import type { LANGUAGE } from '@/constants/language';

export namespace ApiParams {
  export interface CREATE_CHAT {
    userId: string;
    language: LANGUAGE;
    nickname: string;
    emoji: string;
  }
}

export namespace ApiResponse {
  export interface CREATE_CHAT {
    userId: string;
    language: LANGUAGE;
    nickname: string;
    emoji: string;
  }
}

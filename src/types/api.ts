import type { JWTPayload } from 'jose';

import type { LOGIN_PROVIDERS } from '@/constants/etc';
import type { LANGUAGE } from '@/constants/language';
import type { Payload, TOKEN_TYPE } from '@/types/jwt';

export namespace ApiParams {
  export type CREATE_CHAT_INVITE_TOKEN = Pick<
    Payload.InviteToken,
    'hostId' | 'hostEmoji' | 'guestLanguage' | 'guestNickname'
  >;

  export interface CREATE_FRIEND {
    guestId: string;
    inviteToken: string;
  }

  export interface UNLINK_ACCOUNT {
    provider: LOGIN_PROVIDERS;
  }

  export interface EDIT_PROFILE {
    nickname: string;
    emoji: string;
  }

  export interface SEND_MESSAGE {
    channelToken: string;
    message: string;
    fromUserId: string;
    id: string;
  }

  export interface RECEIVE_MESSAGE {
    id: string;
    channelToken: string;
    message: string;
  }

  export interface VERIFY_CHAT_TOKEN<TTokenType extends TOKEN_TYPE> {
    tokenType: TTokenType;
    token: string;
  }

  export interface AUTHENTICATE_PUSHER {
    socketId: string;
    userId: string;
  }
}

export namespace ApiResponse {
  export interface CREATE_CHAT_INVITE_TOKEN {
    inviteToken: string;
  }

  export type CREATE_FRIEND =
    | {
        emoji: string;
        language: LANGUAGE;
        nickname: string;
        userId: string;
      }
    | {
        error: 'expired' | 'invalid';
      };

  export interface UNLINK_ACCOUNT {
    unlinkedProvider: LOGIN_PROVIDERS;
  }

  export interface EDIT_PROFILE {
    nickname: string;
    emoji: string;
  }

  export interface RECEIVE_MESSAGE {
    id: string;
  }

  export interface VERIFY_CHAT_TOKEN<TTokenType extends TOKEN_TYPE> {
    isExpired: boolean;
    tokenType: TOKEN_TYPE;
    payload: (TTokenType extends TOKEN_TYPE.INVITE
      ? Payload.InviteToken
      : Payload.ChannelToken) &
      JWTPayload;
  }
}

export namespace PusherType {
  export interface joinChat {
    channelToken: string;
  }

  export interface addFriend {
    userId: string;
    nickname: string;
    emoji: string;
    language: LANGUAGE;
  }

  export interface sendMessage {
    id: string;
    fromUserId: string;
    message: string;
    translatedMessage: string;
    timestamp: number;
  }

  export interface receiveMessage {
    id: string;
    userId: string;
  }
}

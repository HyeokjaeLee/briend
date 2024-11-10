import type { LOGIN_PROVIDERS } from '@/constants/etc';
import type { LANGUAGE } from '@/constants/language';
import type { Payload, TOKEN_TYPE } from '@/types/jwt';

export namespace ApiParams {
  export interface CREATE_CHAT {
    userId: string;
    language: LANGUAGE;
    guestNickName: string;
    emoji: string;
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
    toUserId: string;
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
}

export namespace ApiResponse {
  export interface CREATE_CHAT {
    inviteToken: string;
  }

  export interface UNLINK_ACCOUNT {
    unlinkedProvider: LOGIN_PROVIDERS;
  }

  export interface EDIT_PROFILE {
    nickname: string;
    emoji: string;
  }

  export interface SEND_MESSAGE {
    id: string;
  }

  export interface RECEIVE_MESSAGE {
    id: string;
  }

  export interface VERIFY_CHAT_TOKEN<TTokenType extends TOKEN_TYPE> {
    isExpired: boolean;
    tokenType: TOKEN_TYPE;
    payload: TTokenType extends TOKEN_TYPE.INVITE
      ? Payload.InviteToken
      : Payload.ChannelToken;
  }
}

export namespace PusherType {
  export interface joinChat {
    channelToken: string;
  }

  export interface sendMessage {
    id: string;
    message: string;
  }

  export interface receiveMessage {
    id: string;
    userId: string;
    translatedMessage: string;
  }
}

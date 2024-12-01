import type { PusherMessage } from './pusher-message';
import type { JWTPayload } from 'jose';

import type { LOGIN_PROVIDERS } from '@/constants/etc';
import type { JwtPayload, TOKEN_TYPE } from '@/types/jwt';

export namespace ApiResponse {
  export interface CREATE_CHAT_INVITE_TOKEN {
    inviteToken: string;
  }

  export type CREATE_FRIEND = PusherMessage.addFriend;

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
      ? JwtPayload.InviteToken
      : JwtPayload.ChannelToken) &
      JWTPayload;
  }
}

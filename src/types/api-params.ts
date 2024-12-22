import type { LOGIN_PROVIDERS } from '@/constants';
import type { JwtPayload, TOKEN_TYPE } from '@/types/jwt';

export namespace ApiParams {
  export type CREATE_CHAT_INVITE_TOKEN = Pick<
    JwtPayload.InviteToken,
    'hostId' | 'guestLanguage' | 'guestNickname'
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

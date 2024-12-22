import type { LANGUAGE } from '@/constants';

export enum TOKEN_TYPE {
  INVITE = 'invite',
  CHANNEL = 'channel',
}

export namespace JwtPayload {
  export interface AccessToken {
    id: string;
    email: string;
    image: string;
    name: string;
  }
  export interface InviteToken {
    hostId: string;
    hostNickname: string;
    hostLanguage: LANGUAGE;
    guestNickname: string;
    guestLanguage: LANGUAGE;
  }

  export interface FriendToken {
    userId: string;
    nickname: string;
    language: LANGUAGE;
    isGuest: boolean;
  }

  export interface ChannelToken extends InviteToken {
    channelId: string;
    guestId: string;
  }
}

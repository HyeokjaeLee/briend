import type { UserSession } from './next-auth';

import type { LANGUAGE, LOGIN_PROVIDERS } from '@/constants';

export namespace JwtPayload {
  export interface InviteToken {
    inviterId: string;
    inviteeLanguage: LANGUAGE;
    inviteId: string;
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

  export interface LinkBaseAccountToken extends UserSession {
    providerToLink: LOGIN_PROVIDERS;
  }

  export interface LinkNewAccountToken {
    providerAccountId: string;
    email?: string;
    name?: string;
    profileImage?: string;
  }

  export interface SyncUserToken {
    provider: LOGIN_PROVIDERS;
    providerId: string;
    name?: string;
    email?: string;
    profileImage?: string;
    language: LANGUAGE;
    anonymousId: string;
  }
}

import type { UserSession } from './next-auth';

import type { LANGUAGE, LOGIN_PROVIDERS } from '@/constants';

export namespace JwtPayload {
  export interface InviteToken {
    inviterId: string;
    inviteeLanguage: LANGUAGE;
    roomId: string;
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

  export interface LinkAccountToken extends UserSession {
    providerToLink: LOGIN_PROVIDERS;
  }
}

import type { LANGUAGE } from '@/constants/language';

export enum TOKEN_TYPE {
  INVITE = 'invite',
  CHANNEL = 'channel',
}

export namespace Payload {
  export interface AccessToken {
    id: string;
    email: string;
    image: string;
    name: string;
  }
  export interface InviteToken {
    hostId: string;
    hostNickname: string;
    hostEmoji: string;
    hostLanguage: LANGUAGE;
    guestNickname: string;
    guestLanguage: LANGUAGE;
  }

  export interface ChannelToken extends InviteToken {
    channelId: string;
    guestId: string;
    guestEmoji: string;
  }
}

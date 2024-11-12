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
    guestNickname: string;
    language: LANGUAGE;
  }

  export interface ChannelToken {
    channelId: string;
    hostId: string;
    hostNickname: string;
    hostEmoji: string;
    guestId: string;
    guestNickname: string;
    guestEmoji: string;
  }
}

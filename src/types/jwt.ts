import type { LANGUAGE } from '@/constants/language';

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
    nickname: string;
    language: LANGUAGE;
  }

  export interface ChannelToken {
    channelId: string;
    hostId: string;
    guestId: string;
  }
}

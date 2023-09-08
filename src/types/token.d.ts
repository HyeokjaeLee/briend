import type { LANGUAGE } from '@/constants';

export interface DecodedChattingRoomToken {
  hostId: string;
  hostName: string;
  guestName: string;
  guestLanguage: LANGUAGE;
  iat: number;
  exp: number;
}

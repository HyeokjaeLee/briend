import type { LANGUAGE } from '@/constants';

export interface ChattingRoom {
  token: string;
  isHost: boolean;
  userName: string;
  userLanguage: LANGUAGE;
  opponentName: string;
  opponentLanguage: LANGUAGE;
  startAt: Date;
  endAt: Date;
}

export interface Message {
  meta: {
    from: string;
    to: string;
    createdAt: Date;
  };
  message: {
    [LANGUAGE.KOREAN]?: string;
    [LANGUAGE.ENGLISH]?: string;
    [LANGUAGE.JAPANESE]?: string;
  };
}

export interface LastMessage {
  token: string;
  message?: string;
}

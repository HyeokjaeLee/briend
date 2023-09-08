import type { LANGUAGE } from '@/constants';

import { DecodedChattingRoomToken } from './token';

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

export interface ChattingRoom
  extends Omit<DecodedChattingRoomToken, 'exp' | 'iat'> {
  startAt: Date;
  endAt: Date;
}

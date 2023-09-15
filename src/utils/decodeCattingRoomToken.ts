import jwt from 'jsonwebtoken';

import type { SignChattingRoomTokenParams } from '@/app/invite/api/[invite]/route';

export interface DecodedChattingRoomToken extends SignChattingRoomTokenParams {
  iat: number;
  exp: number;
}

export const decodeChattingRoomToken = (token: string) =>
  jwt.decode(token) as DecodedChattingRoomToken | null;

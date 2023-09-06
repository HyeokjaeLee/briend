import jwt from 'jsonwebtoken';

import type { DecodedChattingRoomToken } from '@api/chatting-room/join';

export const decodeChattingRoomToken = (token: string) => {
  const decodedToken = jwt.decode(token) as DecodedChattingRoomToken | null;

  if (!decodedToken) return null;

  const { iat, exp, ...chattingRoomInfo } = decodedToken;

  return {
    ...chattingRoomInfo,
    startAt: new Date(iat * 1000),
    endAt: new Date(exp * 1000),
  };
};

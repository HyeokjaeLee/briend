import jwt from 'jsonwebtoken';

import type { DecodedChattingRoomToken } from '@api/chatting-room/join';

import { useChattingStore } from './useChattingStore';

export const useChattingRoomInfoInfoList = () => {
  const chattingRoomTokenList = useChattingStore(
    (state) => state.chattingRoomTokenList,
  );

  return chattingRoomTokenList?.map((token) => {
    const { exp, iat, ...restChattingRoomInfo } = jwt.decode(
      token,
    ) as DecodedChattingRoomToken;

    return {
      start: new Date(iat * 1000),
      end: new Date(exp * 1000),
      token,
      ...restChattingRoomInfo,
    };
  });
};

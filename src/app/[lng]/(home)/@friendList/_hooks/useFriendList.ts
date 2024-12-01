import { useLiveQuery } from 'dexie-react-hooks';
import { decodeJwt } from 'jose';

import { useMemo } from 'react';

import { friend } from '@/stores/indexed-db';
import type { JwtPayload } from '@/types/jwt';
import { CustomError, ERROR_STATUS } from '@/utils/customError';
export const useFriendList = () => {
  const friendTokenList = useLiveQuery(() => {
    if (!friend) throw new CustomError({ status: ERROR_STATUS.NOT_FOUND });

    return friend.toArray();
  });

  const friendList = useMemo(() => {
    if (!friendTokenList) return [];

    return friendTokenList.map((friend) =>
      decodeJwt<JwtPayload.FriendToken>(friend.friendToken),
    );
  }, [friendTokenList]);

  return friendList;
};

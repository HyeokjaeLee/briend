import { useLiveQuery } from 'dexie-react-hooks';
import { decodeJwt } from 'jose';

import { useEffect } from 'react';

import { friendTable } from '@/database/indexed-db';
import { useFriendStore } from '@/stores/friend';
import type { JwtPayload } from '@/types/jwt';
import { CustomError, ERROR_STATUS } from '@/utils/customError';

export const FriendStoreMounter = () => {
  const setFriendStore = useFriendStore((state) => state.setFriendList);

  const friendTokenList = useLiveQuery(() => {
    if (!friendTable) throw new CustomError({ status: ERROR_STATUS.NOT_FOUND });

    return friendTable.toArray();
  });

  useEffect(() => {
    if (!friendTokenList) return;

    const friendList = friendTokenList.map((friend) =>
      decodeJwt<JwtPayload.FriendToken>(friend.friendToken),
    );

    setFriendStore(friendList);
  }, [friendTokenList, setFriendStore]);

  return null;
};

import { decodeJwt } from 'jose';
import { useShallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { friendTable } from '@/database/indexed-db';
import { useIndexedDB } from '@/hooks';
import { useFriendStore } from '@/stores';
import type { JwtPayload } from '@/types/jwt';

export const FriendStoreMounter = () => {
  const [mount, setFriendStore] = useFriendStore(
    useShallow((state) => [state.mount, state.setFriendList]),
  );

  const friendTokenList = useIndexedDB(friendTable, (table) => table.toArray());

  useEffect(() => {
    if (!friendTokenList) return;

    const friendList = friendTokenList.map((friend) =>
      decodeJwt<JwtPayload.FriendToken>(friend.friendToken),
    );

    setFriendStore(friendList);

    mount();
  }, [friendTokenList, setFriendStore, mount]);

  return null;
};

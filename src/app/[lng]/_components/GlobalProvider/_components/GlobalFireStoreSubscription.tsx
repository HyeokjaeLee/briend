import type { DataSnapshot } from 'firebase/database';

import { getAuth } from 'firebase/auth';
import { onChildAdded, ref, remove, get } from 'firebase/database';

import { useEffect } from 'react';

import { trpc } from '@/app/trpc';
import { realtimeDatabase } from '@/database/firebase/client';
import { MESSAGE_STATE, messageTable } from '@/database/indexed-db';
import { useFirebaseStore } from '@/stores/firebase';
import { assert } from '@/utils';

const updateMessage = (
  fromUserId: string,
  toUserId: string,
  snapshot: DataSnapshot,
) => {
  const [createdAt, message, translatedMessage = ''] = snapshot.val();
  const messageId = snapshot.key;

  assert(messageId);

  messageTable?.add({
    id: messageId,
    fromUserId,
    toUserId,
    message,
    translatedMessage,
    timestamp: createdAt,
    state: MESSAGE_STATE.RECEIVE,
  });

  remove(snapshot.ref);
};

export const GlobalFireStoreSubscription = () => {
  const setRealtimeChattingData = useFirebaseStore(
    (state) => state.setRealtimeChattingData,
  );

  const getFriendListQuery = trpc.friend.getFriendList.useQuery();

  const friendList = getFriendListQuery.data?.friendList;

  useEffect(() => {
    if (!friendList?.length) return;

    const { currentUser } = getAuth();

    assert(currentUser);

    const unsubscribeList = friendList.map(async (friend) => {
      const messageRef = ref(
        realtimeDatabase,
        `${currentUser.uid}/chat/${friend.id}/msg`,
      );

      const messageListSnapshot = await get(messageRef);

      if (messageListSnapshot.exists()) {
        messageListSnapshot.forEach((snapshot) =>
          updateMessage(currentUser.uid, friend.id, snapshot),
        );
      }

      const unsubscribe = onChildAdded(messageRef, (snapshot) =>
        updateMessage(currentUser.uid, friend.id, snapshot),
      );

      return unsubscribe;
    });

    return () => {
      unsubscribeList.forEach((promise) =>
        promise.then((unsubscribe) => unsubscribe()),
      );
    };
  }, [setRealtimeChattingData, friendList]);

  return null;
};

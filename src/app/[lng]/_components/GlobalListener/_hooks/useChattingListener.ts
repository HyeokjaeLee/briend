import { getAuth } from 'firebase/auth';
import type { DataSnapshot } from 'firebase/database';
import { get, onChildAdded, ref, remove } from 'firebase/database';
import { useEffect } from 'react';

import { trpc } from '@/configs/trpc';
import { realtimeDatabase } from '@/database/firebase/client';
import { chattingDB, MESSAGE_STATE } from '@/database/indexed';
import { useFirebaseStore } from '@/stores/firebase';
import { assert } from '@/utils';

const updateMessage = (receiverId: string, snapshot: DataSnapshot) => {
  const [createdAt, message, translatedMessage = ''] = snapshot.val();
  const messageId = snapshot.key;

  assert(messageId);

  chattingDB.messages.add({
    id: messageId,
    state: MESSAGE_STATE.RECEIVE,
    message,
    translatedMessage,
    timestamp: createdAt,
    isMine: false,
    userId: receiverId,
  });

  remove(snapshot.ref);
};

export const useChattingListener = () => {
  const setRealtimeChattingData = useFirebaseStore(
    (state) => state.setRealtimeChattingData,
  );

  const getFriendListQuery = trpc.friend.list.useQuery();

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
          updateMessage(friend.id, snapshot),
        );
      }

      const unsubscribe = onChildAdded(messageRef, (snapshot) =>
        updateMessage(friend.id, snapshot),
      );

      return unsubscribe;
    });

    return () => {
      unsubscribeList.forEach((promise) =>
        promise.then((unsubscribe) => unsubscribe()),
      );
    };
  }, [setRealtimeChattingData, friendList]);
};

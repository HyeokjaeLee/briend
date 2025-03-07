import { getAuth } from 'firebase/auth';
import type { DataSnapshot } from 'firebase/database';
import { get, onChildAdded, ref } from 'firebase/database';
import { useEffect } from 'react';

import { trpc } from '@/configs/trpc';
import { realtimeDatabase } from '@/database/firebase/client';
import { chattingDB, MESSAGE_STATE } from '@/database/indexed';
import { useFirebaseStore } from '@/stores/firebase';
import { assert } from '@/utils';

const updateMessage = async (receiverId: string, snapshot: DataSnapshot) => {
  const [createdAt, message, translatedMessage = ''] = snapshot.val();
  const messageId = snapshot.key;

  assert(messageId);

  // 먼저 메시지가 이미 존재하는지 확인
  const existingMessage = await chattingDB.messages.get(messageId);

  if (existingMessage) {
    // 이미 존재하면 업데이트
    await chattingDB.messages.update(messageId, {
      message,
      translatedMessage,
      timestamp: createdAt,
      // 다른 필드는 유지
    });
  } else {
    // 존재하지 않으면 새로 추가
    await chattingDB.messages.add({
      id: messageId,
      state: MESSAGE_STATE.RECEIVE,
      message,
      translatedMessage,
      timestamp: createdAt,
      isMine: false,
      userId: receiverId,
    });
  }
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
        // 각 메시지를 순회하면서 처리
        const promises: Promise<void>[] = [];
        messageListSnapshot.forEach((snapshot) => {
          promises.push(updateMessage(friend.id, snapshot));
        });

        // 모든 Promise가 완료될 때까지 대기
        await Promise.all(promises);
      }

      // onChildAdded 이벤트 리스너 설정
      const unsubscribe = onChildAdded(messageRef, async (snapshot) => {
        await updateMessage(friend.id, snapshot);
      });

      return unsubscribe;
    });

    return () => {
      unsubscribeList.forEach((promise) =>
        promise.then((unsubscribe) => unsubscribe()),
      );
    };
  }, [setRealtimeChattingData, friendList]);
};

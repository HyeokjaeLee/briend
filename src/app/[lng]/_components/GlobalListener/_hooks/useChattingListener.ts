import { getAuth } from 'firebase/auth';
import type { DatabaseReference, DataSnapshot } from 'firebase/database';
import { get, onChildAdded, ref, remove } from 'firebase/database';
import { useEffect } from 'react';

import { trpc } from '@/configs/trpc';
import { realtimeDatabase } from '@/database/firebase/client';
import { chattingDB, MESSAGE_STATE } from '@/database/indexed';
import { useFirebaseStore } from '@/stores/firebase';
import { assert } from '@/utils';

// 최대 보존할 메시지 수
const MAX_MESSAGES_TO_KEEP = 10;

// 메시지 타입 정의
interface MessageItem {
  id: string | null;
  timestamp: number;
  ref: DatabaseReference;
}

// IndexedDB에 메시지가 있는지 확인
const isMessageInIndexedDB = async (messageId: string): Promise<boolean> => {
  const message = await chattingDB.messages.get(messageId);

  return !!message;
};

// 메시지 업데이트 및 관리
const updateMessage = async (
  receiverId: string,
  snapshot: DataSnapshot,
  chatRef: DatabaseReference,
) => {
  const [createdAt, message, translatedMessage = ''] = snapshot.val();
  const messageId = snapshot.key;

  assert(messageId);

  // 이미 IndexedDB에 메시지가 있는지 확인
  const exists = await isMessageInIndexedDB(messageId);

  if (!exists) {
    // IndexedDB에 추가
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

  // 메시지 총 개수 확인
  const messagesSnapshot = await get(chatRef);
  if (messagesSnapshot.exists()) {
    const messages: MessageItem[] = [];

    // 모든 메시지를 배열로 변환
    messagesSnapshot.forEach((msgSnapshot) => {
      const msgData = msgSnapshot.val();
      const msgId = msgSnapshot.key;
      const timestamp = msgData[0]; // 첫 번째 요소가 timestamp

      messages.push({
        id: msgId,
        timestamp,
        ref: msgSnapshot.ref,
      });
    });

    // 타임스탬프 기준으로 정렬 (오래된 것부터)
    messages.sort((a, b) => a.timestamp - b.timestamp);

    // 최근 10개를 제외한 나머지 메시지 삭제
    if (messages.length > MAX_MESSAGES_TO_KEEP) {
      const messagesToDelete = messages.slice(
        0,
        messages.length - MAX_MESSAGES_TO_KEEP,
      );

      // 삭제 실행
      for (const msg of messagesToDelete) {
        await remove(msg.ref);
      }
    }
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
        messageListSnapshot.forEach((snapshot) => {
          updateMessage(friend.id, snapshot, messageRef);
        });
      }

      const unsubscribe = onChildAdded(messageRef, (snapshot) =>
        updateMessage(friend.id, snapshot, messageRef),
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

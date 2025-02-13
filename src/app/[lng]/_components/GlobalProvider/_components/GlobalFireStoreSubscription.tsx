import { getAuth } from 'firebase/auth';
import { onChildAdded, onChildChanged, onValue, ref } from 'firebase/database';

import { useEffect } from 'react';

import { realtimeDatabase } from '@/database/firebase/client';
import type { UserRealtimeData } from '@/database/firebase/type';
import { useFirebaseStore } from '@/stores/firebase';
import { assert } from '@/utils';

export const GlobalFireStoreSubscription = () => {
  const setRealtimeChattingData = useFirebaseStore(
    (state) => state.setRealtimeChattingData,
  );

  useEffect(() => {
    const { currentUser } = getAuth();

    assert(currentUser);

    console.log(currentUser, 'currentUser');

    const dataRef = ref(realtimeDatabase, currentUser.uid);

    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        const userRealtimeData: UserRealtimeData | null = snapshot.val();

        if (userRealtimeData) {
          console.log(userRealtimeData, 'onValue');
        }
      },
      (error) => {
        console.error(error);
      },
    );

    onChildAdded(
      ref(realtimeDatabase, `${currentUser.uid}/chat/test4/msg`),
      (snapshot) => {
        console.log(snapshot.val(), 'onChildAdded');
      },
    );

    // 메시지 수정 (번역 완료 등)
    onChildChanged(dataRef, (snapshot) => {
      console.log(snapshot.val(), 'onChildChanged');
    });

    return unsubscribe;
  }, [setRealtimeChattingData]);

  return null;
};

import { initializeApp } from 'firebase/app';
import type { DataSnapshot, Unsubscribe } from 'firebase/database';
import {
  getDatabase,
  onChildAdded,
  onChildChanged,
  onChildMoved,
  onChildRemoved,
  onValue,
  ref,
} from 'firebase/database';
import type { Firestore } from 'firebase/firestore';
import { collection, doc, getFirestore } from 'firebase/firestore';
import { useEffect, useReducer } from 'react';

import { PUBLIC_ENV } from '@/constants';
import { CustomError } from '@/utils';

export const app = initializeApp({
  apiKey: PUBLIC_ENV.FIREBASE_API_KEY,
  authDomain: PUBLIC_ENV.FIREBASE_AUTH_DOMAIN,
  projectId: PUBLIC_ENV.FIREBASE_PROJECT_ID,
  storageBucket: PUBLIC_ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: PUBLIC_ENV.FIREBASE_APP_ID,
  measurementId: PUBLIC_ENV.FIREBASE_MEASUREMENT_ID,
  databaseURL: PUBLIC_ENV.FIREBASE_DATABASE_URL,
});

// 상태 타입 정의
type RealtimeState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// 액션 타입 정의
type RealtimeAction<T> =
  | {
      type: 'DATA_UPDATED';
      payload: T;
      previousChildName?: string | null;
      key: string | null;
    }
  | { type: 'LOADING' }
  | { type: 'ERROR'; payload: string };

// 리듀서 함수
const realtimeDatabaseDispatcher = <T>(
  state: RealtimeState<T>,
  action: RealtimeAction<T>,
): RealtimeState<T> => {
  switch (action.type) {
    case 'DATA_UPDATED':
      return { ...state, data: action.payload, loading: false, error: null };
    case 'LOADING':
      return { ...state, loading: true, error: null };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const realtimeDatabase = getDatabase(app);

type LinstenerType =
  | 'onValue'
  | 'onChildChanged'
  | 'onChildAdded'
  | 'onChildMoved'
  | 'onChildRemoved';

export const useRealtimeDatabase = <T>(type: LinstenerType, path: string) => {
  const [state, dispatch] = useReducer(realtimeDatabaseDispatcher<T>, {
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const dataRef = ref(realtimeDatabase, path);

    const listener: (
      query: typeof dataRef,
      callback: (
        snapshot: DataSnapshot,
        previousChildName?: string | null,
      ) => unknown,
      cancelCallback?: (error: Error) => unknown,
    ) => Unsubscribe = {
      onValue,
      onChildChanged,
      onChildAdded,
      onChildMoved,
      onChildRemoved,
    }[type];

    dispatch({ type: 'LOADING' });

    const unsubscribe = listener(
      dataRef,
      (snapshot, previousChildName) => {
        const value = snapshot.val() as T;
        dispatch({
          type: 'DATA_UPDATED',
          payload: value,
          previousChildName,
          key: snapshot.key,
        });
      },
      (error) => {
        try {
          throw new CustomError({
            code: 'INTERNAL_REALTIME_DATABASE_ERROR',
            message: error.message,
            cause: error.cause,
          });
        } catch (err) {
          if (err instanceof CustomError) {
            dispatch({ type: 'ERROR', payload: err.message });
          } else {
            throw err;
          }
        }
      },
    );

    return () => unsubscribe();
  }, [path, type]);

  return state;
};

interface FirestoreParams {
  firestore: Firestore;
  collection: (
    path: string,
    ...pathSegments: string[]
  ) => ReturnType<typeof collection>;
  doc: (path: string, ...pathSegments: string[]) => ReturnType<typeof doc>;
}

export const firestore = <T>(callback: (params: FirestoreParams) => T) => {
  const firestore = getFirestore();

  return callback({
    firestore,
    collection: (path, ...pathSegments) =>
      collection(firestore, path, ...pathSegments),
    doc: (path, ...pathSegments) => doc(firestore, path, ...pathSegments),
  });
};

import type { Firestore } from 'firebase/firestore';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { collection, doc, getFirestore } from 'firebase/firestore';

import { useEffect, useReducer } from 'react';

import { PUBLIC_ENV } from '@/constants';

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
  | { type: 'DATA_UPDATED'; payload: T }
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

export const useRealTimeDatabase = <T>(path: string) => {
  const [state, dispatch] = useReducer(realtimeDatabaseDispatcher<T>, {
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    dispatch({ type: 'LOADING' });

    const dataRef = ref(realtimeDatabase, path);

    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        const value = snapshot.val() as T;
        dispatch({ type: 'DATA_UPDATED', payload: value });
      },
      (error) => {
        dispatch({ type: 'ERROR', payload: error.message });
      },
    );

    return () => unsubscribe();
  }, [path]);

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

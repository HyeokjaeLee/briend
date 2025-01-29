import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getSession } from 'next-auth/react';

import { trpcClient } from '@/app/trpc/client';
import { IS_CLIENT, PUBLIC_ENV } from '@/constants';

const firebaseConfig = {
  apiKey: PUBLIC_ENV.FIREBASE_API_KEY,
  authDomain: PUBLIC_ENV.FIREBASE_AUTH_DOMAIN,
  projectId: PUBLIC_ENV.FIREBASE_PROJECT_ID,
  storageBucket: PUBLIC_ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: PUBLIC_ENV.FIREBASE_APP_ID,
  measurementId: PUBLIC_ENV.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const initFirebase = async () => {
  if (!IS_CLIENT) return;

  getAnalytics(app);

  const isLogin = !!(await getSession());

  if (!isLogin) return;

  const auth = getAuth();

  const customToken = await trpcClient.getFirebaseCustomToken.query();

  await signInWithCustomToken(auth, customToken);
};

export const firebase = initFirebase();

import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
} from 'firebase/auth';
import { getSession } from 'next-auth/react';

import { trpcClient } from '@/app/trpc';
import { IS_CLIENT } from '@/constants';
import { app } from '@/database/firebase/client';
import { useGlobalStore } from '@/stores';

const initFirebase = async () => {
  if (!IS_CLIENT) return;
  const { setGlobalLoading } = useGlobalStore.getState();

  setGlobalLoading(true);

  getAnalytics(app);

  const auth = getAuth();

  const session = await getSession();

  const isLogin = !!session;

  if (isLogin) {
    const customToken = await trpcClient.getFirebaseCustomToken.query();
    await signInWithCustomToken(auth, customToken);
  } else {
    await signInAnonymously(auth);
  }

  setGlobalLoading(false);

  return auth;
};

export const firebase = initFirebase();

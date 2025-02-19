import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
} from 'firebase/auth';

import { IS_CLIENT } from '@/constants';
import { app } from '@/database/firebase/client';
import { API_ROUTES } from '@/routes/api';
import { useGlobalStore } from '@/stores';

const initFirebase = async () => {
  if (!IS_CLIENT) return;
  const { setGlobalLoading } = useGlobalStore.getState();

  setGlobalLoading(true);

  getAnalytics(app);

  const auth = getAuth();

  const { customToken, isLogin } =
    await API_ROUTES.GET_FIREBASE_CUSTOM_TOKEN().json();

  if (isLogin) {
    await signInWithCustomToken(auth, customToken);
  } else {
    await signInAnonymously(auth);
  }

  setGlobalLoading(false);

  return auth;
};

export const firebase = initFirebase();

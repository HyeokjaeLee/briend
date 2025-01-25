import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

import { PUBLIC_ENV } from '@/constants';
import { PRIVATE_ENV } from '@/constants/private-env';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      clientEmail: PRIVATE_ENV.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: PRIVATE_ENV.FIREBASE_ADMIN_PRIVATE_KEY,
      projectId: PUBLIC_ENV.FIREBASE_APP_ID,
    }),
  });
}

export const getFirebaseAdminAuth = getAuth;

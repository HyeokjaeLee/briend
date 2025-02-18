import { cert,getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { getFirestore } from 'firebase-admin/firestore';

import { PUBLIC_ENV } from '@/constants';
import { PRIVATE_ENV } from '@/constants/private-env';
import { CustomError } from '@/utils';

const apps = getApps();

const [app] = apps;

if (!app) {
  initializeApp({
    credential: cert({
      clientEmail: PRIVATE_ENV.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: PRIVATE_ENV.FIREBASE_ADMIN_PRIVATE_KEY,
      projectId: PUBLIC_ENV.FIREBASE_PROJECT_ID,
    }),
    databaseURL: PUBLIC_ENV.FIREBASE_DATABASE_URL,
  });
}

const firestore = getFirestore();

const adminAuth = getAuth();

const verifyFirebaseIdToken = async <T extends string | null | undefined>(
  firebaseToken: T,
) => {
  if (typeof firebaseToken !== 'string')
    throw new CustomError({
      code: 'UNAUTHORIZED',
      message: 'firebaseToken must be a string',
    });

  try {
    const payload = await adminAuth.verifyIdToken(firebaseToken);

    return {
      payload,
      adminAuth,
    };
  } catch {
    throw new CustomError({
      code: 'UNAUTHORIZED',
      message: 'firebaseToken is invalid',
    });
  }
};

const realtimeDatabase = getDatabase(app);

export { adminAuth, firestore, realtimeDatabase,verifyFirebaseIdToken };

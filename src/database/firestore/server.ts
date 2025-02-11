import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

import { PUBLIC_ENV } from '@/constants';
import { PRIVATE_ENV } from '@/constants/private-env';
import { CustomError } from '@/utils';

const getFirebaseAdminApp = async () => {
  const apps = getApps();

  const [app] = apps;

  if (app) return app;

  return initializeApp({
    credential: cert({
      clientEmail: PRIVATE_ENV.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: PRIVATE_ENV.FIREBASE_ADMIN_PRIVATE_KEY,
      projectId: PUBLIC_ENV.FIREBASE_PROJECT_ID,
    }),
  });
};

export const firestore = async <T>(
  callback: (db: FirebaseFirestore.Firestore) => T,
) => {
  const { getFirestore } = await import('firebase-admin/firestore');

  const app = await getFirebaseAdminApp();

  const firestore = getFirestore(app);

  return callback(firestore);
};

export const getFirebaseAdminAuth = async () => {
  const adminApp = await getFirebaseAdminApp();

  return getAuth(adminApp);
};

export const verifyFirebaseIdToken = async <
  T extends string | null | undefined,
>(
  firebaseToken: T,
) => {
  if (typeof firebaseToken !== 'string')
    throw new CustomError({
      code: 'UNAUTHORIZED',
      message: 'firebaseToken must be a string',
    });

  try {
    const adminAuth = await getFirebaseAdminAuth();

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

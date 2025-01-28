import { PUBLIC_ENV } from '@/constants';
import { PRIVATE_ENV } from '@/constants/private-env';

export const getFirebaseAdminApp = async () => {
  const { getApps, initializeApp, cert } = await import('firebase-admin/app');

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

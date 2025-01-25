import { PUBLIC_ENV } from '@/constants';
import { PRIVATE_ENV } from '@/constants/private-env';

export const getAdminApp = async () => {
  const { getApps, initializeApp, cert } = await import('firebase-admin/app');

  const apps = getApps();

  if (apps.length) return apps[0];

  return initializeApp({
    credential: cert({
      clientEmail: PRIVATE_ENV.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: PRIVATE_ENV.FIREBASE_ADMIN_PRIVATE_KEY,
      projectId: PUBLIC_ENV.FIREBASE_PROJECT_ID,
    }),
  });
};

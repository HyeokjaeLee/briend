export const runtime = 'nodejs';

import { getFirebaseAdminApp } from './getFirebaseAdminApp';

export const getFirebaseAdminAuth = async () => {
  const adminApp = await getFirebaseAdminApp();

  const { getAuth } = await import('firebase-admin/auth');

  return getAuth(adminApp);
};

import { getAdminApp } from './getAdminApp';

export const getFirebaseAdminAuth = async () => {
  const adminApp = await getAdminApp();

  const { getAuth } = await import('firebase-admin/auth');

  return getAuth(adminApp);
};

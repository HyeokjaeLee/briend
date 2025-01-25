import { getAdminApp } from '@/utils/server/getAdminApp';

export const firestore = async <T>(
  callback: (db: FirebaseFirestore.Firestore) => T,
) => {
  const { getFirestore } = await import('firebase-admin/firestore');

  const app = await getAdminApp();

  const firestore = getFirestore(app);

  return callback(firestore);
};

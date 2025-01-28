import { getFirebaseAdminApp } from '@/utils/server';

export const firestore = async <T>(
  callback: (db: FirebaseFirestore.Firestore) => T,
) => {
  const { getFirestore } = await import('firebase-admin/firestore');

  const app = await getFirebaseAdminApp();

  const firestore = getFirestore(app);

  return callback(firestore);
};

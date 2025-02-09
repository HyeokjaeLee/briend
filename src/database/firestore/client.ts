import type { Firestore } from 'firebase/firestore';

import { collection, doc, getFirestore } from 'firebase/firestore';

interface FirestoreParams {
  firestore: Firestore;
  collection: (
    path: string,
    ...pathSegments: string[]
  ) => ReturnType<typeof collection>;
  doc: (path: string, ...pathSegments: string[]) => ReturnType<typeof doc>;
}

export const firestore = <T>(callback: (params: FirestoreParams) => T) => {
  const firestore = getFirestore();

  return callback({
    firestore,
    collection: (path, ...pathSegments) =>
      collection(firestore, path, ...pathSegments),
    doc: (path, ...pathSegments) => doc(firestore, path, ...pathSegments),
  });
};

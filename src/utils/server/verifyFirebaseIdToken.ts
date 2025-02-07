import { CustomError } from '../customError';

import { getFirebaseAdminAuth } from './getFirebaseAdminAuth';

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

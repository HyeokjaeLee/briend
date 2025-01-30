import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { CustomError } from '../customError';

const PATHS = {
  profileImage: (userId: string) => `users/${userId}/profile`,
};

interface UploadFirebaseStorageInput {
  file: File;
  path: (paths: typeof PATHS) => string;
}

export const uploadFirebaseStorage = async ({
  file,
  path,
}: UploadFirebaseStorageInput) => {
  const storage = getStorage();
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const fullPath = [path(PATHS), extension].join('.');

  try {
    const storageRef = ref(storage, fullPath);

    await uploadBytes(storageRef, file);

    const downloadUrl = await getDownloadURL(storageRef);

    return downloadUrl;
  } catch (e) {
    throw new CustomError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `Failed to upload file: ${fullPath}`,
      cause: String(e),
    });
  }
};

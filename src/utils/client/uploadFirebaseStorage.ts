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

  try {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    const fullPath = [path(PATHS), extension].join('.');

    const storageRef = ref(storage, fullPath);

    await uploadBytes(storageRef, file);

    const downloadUrl = await getDownloadURL(storageRef);

    return downloadUrl;
  } catch (e) {
    console.error(e);

    throw new CustomError();
  }
};

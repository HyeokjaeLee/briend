import { useEffect } from 'react';

import { profileImageTable } from '@/database/indexed-db';

import { useImageBlobUrl } from './useImageBlobUrl';
import { useIndexedDB } from './useIndexedDB';
import { useUserData } from './useUserData';

export const useMyProfileImage = () => {
  const { user } = useUserData();
  const userId = user?.id;

  const profileImage = useIndexedDB(
    profileImageTable,
    (table) => {
      if (!userId) return;

      return table.get(userId);
    },
    [userId],
  );

  const myProfileImageBlob = profileImage?.blob;

  const [profileImageSrc, dispatchProfileImage] = useImageBlobUrl();

  useEffect(() => {
    if (myProfileImageBlob) {
      dispatchProfileImage({
        type: 'CREATE',
        payload: myProfileImageBlob,
      });
    }
  }, [myProfileImageBlob, dispatchProfileImage]);

  return { profileImageSrc };
};

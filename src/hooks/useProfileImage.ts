import { useEffect } from 'react';

import { profileImageTable } from '@/database/indexed-db';

import { useImageBlobUrl } from './useImageBlobUrl';
import { useIndexedDB } from './useIndexedDB';
import { useUserData } from './useUserData';

export const useProfileImage = (userId?: string) => {
  const { user } = useUserData();

  const profileId = userId || user?.id;

  const profileImage = useIndexedDB(
    profileImageTable,
    (table) => {
      if (!profileId) return;

      return table.get(profileId);
    },
    [profileId],
  );

  const profileImageBlob = profileImage?.blob;

  const [profileImageSrc, dispatchProfileImage] = useImageBlobUrl();

  useEffect(() => {
    if (profileImageBlob) {
      dispatchProfileImage({
        type: 'CREATE',
        payload: profileImageBlob,
      });
    }
  }, [profileImageBlob, dispatchProfileImage]);

  return { profileImageSrc, profileImage };
};

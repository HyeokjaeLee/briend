import {
  profileImageTable,
  type ProfileImageTableItem,
} from '@/database/indexed-db';

/**
 * @description peer.js 데이터를 통해 blob값을 전달하면 직렬화된 데이터를 받음, 다시 blob로 변환하여 indexedDB에 저장
 */
export const addProfileImageFromPeer = async (
  profileImage?: ProfileImageTableItem,
) => {
  if (!profileImage) return;

  await profileImageTable?.add({
    ...profileImage,
    blob: new Blob([profileImage.blob], {
      type: profileImage.type,
    }),
  });
};

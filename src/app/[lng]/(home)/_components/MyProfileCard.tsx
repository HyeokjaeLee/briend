import { useShallow } from 'zustand/shallow';

import { useEffect } from 'react';
import CountUp from 'react-countup';
import { TbFriends, TbFriendsOff } from 'react-icons/tb';

import { useTranslation } from '@/app/i18n/client';
import { ProfileImage, CustomLink } from '@/components';
import { MAX_FIREND_COUNT } from '@/constants';
import { profileImageTable } from '@/database/indexed-db';
import { useImageBlobUrl, useIndexedDB } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useFriendStore } from '@/stores';

interface MyProfileCardProps {
  userId: string;
  userName?: string;
}

export const MyProfileCard = ({
  userId,
  userName = 'Unknown',
}: MyProfileCardProps) => {
  const profileImage = useIndexedDB(
    profileImageTable,
    (table) => table.get(userId),
    [userId],
  );

  const myProfileImageBlob = profileImage?.blob;

  const [profileImageSrc, dispatchProfileImage] = useImageBlobUrl();

  const { t } = useTranslation('friend-list');

  useEffect(() => {
    if (myProfileImageBlob) {
      dispatchProfileImage({
        type: 'CREATE',
        payload: myProfileImageBlob,
      });
    }
  }, [myProfileImageBlob, dispatchProfileImage]);

  const [firendCount, isLimitedAddFriend] = useFriendStore(
    useShallow((state) => [state.friendList.length, state.isLinimtedAddFriend]),
  );

  return (
    <CustomLink
      className="relative block px-5 py-3"
      href={ROUTES.EDIT_PROFILE.pathname}
    >
      <article className="flex gap-3">
        <ProfileImage size="6" src={profileImageSrc} />
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <strong>{userName}</strong>
            <p className="text-zinc-500">{t('edit-profile')}</p>
          </div>
          <div className="mb-auto flex items-center gap-2 font-bold">
            {isLimitedAddFriend ? (
              <TbFriendsOff className="text-red-500" />
            ) : (
              <TbFriends className="text-green-500" />
            )}

            <small className="min-w-11">
              <CountUp
                className={
                  isLimitedAddFriend ? 'text-red-500' : 'text-green-500'
                }
                duration={0.3}
                end={firendCount}
              />{' '}
              / <span>{MAX_FIREND_COUNT}</span>
            </small>
          </div>
        </div>
      </article>
    </CustomLink>
  );
};

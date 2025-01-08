import { useShallow } from 'zustand/shallow';

import CountUp from 'react-countup';
import { RiLink, RiLinkUnlinkM, RiMessage2Line } from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/client';
import { ProfileImage, CustomLink } from '@/components';
import { MAX_FIREND_COUNT } from '@/constants';
import { useProfileImage } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useFriendStore } from '@/stores';

interface MyProfileCardProps {
  userName?: string;
}

export const MyProfileCard = ({ userName = 'Unknown' }: MyProfileCardProps) => {
  const { t } = useTranslation('friend-list');

  const [firendCount, isLimitedAddFriend] = useFriendStore(
    useShallow((state) => [state.friendList.length, state.isLinimtedAddFriend]),
  );

  const { profileImageSrc } = useProfileImage();

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
          <div />
          <ul className="mt-auto flex flex-col">
            <li className="flex items-center gap-2">
              <RiMessage2Line />
              <CountUp className="text-sm" duration={0.3} end={firendCount} />
            </li>
            <li className="flex items-center gap-2">
              {isLimitedAddFriend ? (
                <RiLinkUnlinkM className="text-red-500" />
              ) : (
                <RiLink className="text-green-500" />
              )}
              <small className="min-w-11 text-sm">
                <CountUp
                  className={
                    isLimitedAddFriend ? 'text-red-500' : 'text-green-500'
                  }
                  delay={0.1}
                  duration={0.3}
                  end={firendCount}
                />{' '}
                / <span>{MAX_FIREND_COUNT}</span>
              </small>
            </li>
          </ul>
        </div>
      </article>
    </CustomLink>
  );
};

import { Avatar, CustomLink, Skeleton } from '@/components';
import { useTranslation } from '@/configs/i18n/client';
import { useUserData } from '@/hooks';
import { ROUTES } from '@/routes/client';

interface MyProfileCardProps {
  userName?: string;
}

export const MyProfileCard = ({ userName = 'Unknown' }: MyProfileCardProps) => {
  const { t } = useTranslation('friend-list');

  const { user } = useUserData();

  return (
    <CustomLink
      className="relative block px-5 py-3"
      href={ROUTES.EDIT_PROFILE.pathname}
    >
      <article className="flex gap-3">
        <Avatar size={18} src={user?.profileImage} userId={user?.id} />
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <strong>{userName}</strong>
            <p className="text-zinc-500">{t('edit-profile')}</p>
          </div>
          <div />
        </div>
      </article>
    </CustomLink>
  );
};

export const MyProfileCardSkeleton = () => (
  <div className="flex h-28 items-center gap-4 px-5">
    <Skeleton className="size-20 rounded-full" />
    <div className="flex flex-col gap-1">
      <Skeleton className="h-6 w-36" />
      <Skeleton className="h-5 w-44" />
    </div>
  </div>
);

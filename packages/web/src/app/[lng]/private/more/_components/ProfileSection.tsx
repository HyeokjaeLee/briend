'use client';

import { Avatar, Badge, Skeleton } from '@/components';
import { useTranslation } from '@/configs/i18n/client';
import { LANGUAGE_NAME } from '@/constants';
import { useUserData } from '@/hooks';
import { cn } from '@/utils';

interface ProfileSectionProps {
  className?: string;
}

export const ProfileSection = ({ className }: ProfileSectionProps) => {
  const { user } = useUserData();

  const { t } = useTranslation('more');

  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center gap-1',
        className,
      )}
    >
      <Skeleton loading={!user}>
        <Avatar size={26} src={user?.profileImage} userId={user?.id} />
      </Skeleton>
      <div className="mt-4 flex items-center justify-center gap-2">
        <Skeleton className="h-7 w-28" loading={!user}>
          <p className="text-xl font-medium">{user?.name}</p>
        </Skeleton>
        {user?.language ? (
          <Badge className="mt-1" color="yellow">
            {LANGUAGE_NAME[user.language]}
          </Badge>
        ) : (
          <Skeleton className="h-5 w-10" />
        )}
      </div>
      <Skeleton className="h-6 w-32" loading={!user}>
        <p className="text-slate-400">{user?.email || t('empty-email')}</p>
      </Skeleton>
    </section>
  );
};

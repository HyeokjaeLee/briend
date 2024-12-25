'use client';

import { useParams } from 'next/navigation';

import { useTranslation } from '@/app/i18n/client';
import { LANGUAGE_NAME, type LANGUAGE } from '@/constants';
import { useUserData } from '@/hooks';
import { cn } from '@/utils';
import { Avatar, Badge, Skeleton } from '@radix-ui/themes';

interface ProfileSectionProps {
  className?: string;
}

export const ProfileSection = ({ className }: ProfileSectionProps) => {
  const { user } = useUserData();

  const { lng } = useParams<{ lng: LANGUAGE }>();
  const { t } = useTranslation('more');

  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center gap-1',
        className,
      )}
    >
      <Skeleton loading={!user}>
        <Avatar
          fallback={<span className="text-5xl">s</span>}
          radius="full"
          size="7"
        />
      </Skeleton>
      <div className="mt-4 flex items-center justify-center gap-2">
        <Skeleton className="h-7 w-28" loading={!user}>
          <p className="text-xl font-medium">{user?.name}</p>
        </Skeleton>
        <Badge className="mt-1" color="yellow">
          {LANGUAGE_NAME[lng]}
        </Badge>
      </div>
      <Skeleton className="h-6 w-32" loading={!user}>
        <p className="text-slate-400">{user?.email || t('empty-email')}</p>
      </Skeleton>
    </section>
  );
};

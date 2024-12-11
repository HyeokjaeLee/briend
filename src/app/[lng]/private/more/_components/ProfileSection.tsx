'use client';

import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { useTranslation } from '@/app/i18n/client';
import type { LANGUAGE } from '@/constants/language';
import { LANGUAGE_NAME } from '@/constants/language';
import { cn } from '@/utils/cn';
import { Avatar, Badge, Skeleton } from '@radix-ui/themes';

interface ProfileSectionProps {
  className?: string;
}

export const ProfileSection = ({ className }: ProfileSectionProps) => {
  const session = useSession();

  const { lng } = useParams<{ lng: LANGUAGE }>();
  const { t } = useTranslation('more');

  const user = session.data?.user;

  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center gap-1',
        className,
      )}
    >
      <Skeleton loading={!user}>
        <Avatar
          fallback={<span className="text-5xl">{user?.emoji}</span>}
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

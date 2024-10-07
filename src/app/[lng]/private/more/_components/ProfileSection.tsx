'use client';

import type { Session } from 'next-auth';

import { useParams } from 'next/navigation';
import { getSession } from 'next-auth/react';

import { useEffect, useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import type { LANGUAGE } from '@/constants/language';
import { LANGUAGE_NAME } from '@/constants/language';
import { cn } from '@/utils/cn';
import { Badge } from '@radix-ui/themes';

interface ProfileSectionProps {
  className?: string;
}

export const ProfileSection = ({ className }: ProfileSectionProps) => {
  const [session, setSession] = useState<Session>();

  useEffect(() => {
    //! 아직 react 19 `use` hook이 불안정 한듯함 추후 `use` 안정화되면 사용 예정
    getSession().then((session) => {
      if (session) setSession(session);
    });
  }, []);

  const { lng } = useParams<{ lng: LANGUAGE }>();

  const { t } = useTranslation('more');

  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center',
        session ? 'animate-fade-down' : 'invisible',
        className,
      )}
    >
      <div className="flex size-36 select-none items-center justify-center rounded-full bg-slate-350 text-8xl">
        {session?.user.emoji}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        <p className="text-xl font-medium">
          {session?.user.name || 'Unknown User'}
        </p>
        <Badge className="mt-1" color="yellow">
          {LANGUAGE_NAME[lng]}
        </Badge>
      </div>
      <p className="text-slate-350">
        {session?.user.email || t('empty-email')}
      </p>
    </section>
  );
};

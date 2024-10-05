'use client';

import { useParams } from 'next/navigation';
import { shallow } from 'zustand/shallow';

import type { LANGUAGE } from '@/constants/language';
import { LANGUAGE_NAME } from '@/constants/language';
import { useProfileStore } from '@/stores/profile';
import { cn } from '@/utils/cn';

interface ProfileSectionProps {
  className?: string;
}

export const ProfileSection = ({ className }: ProfileSectionProps) => {
  const [emoji, nickname] = useProfileStore(
    (state) => [state.emoji, state.nickname],
    shallow,
  );

  const { lng } = useParams<{ lng: LANGUAGE }>();

  return (
    <section
      className={cn('flex flex-col items-center justify-center', className)}
    >
      <div className="flex size-36 items-center justify-center rounded-full bg-slate-350 text-8xl">
        {emoji}
      </div>
      <p className="mt-4 text-xl font-medium">{nickname}</p>
      <p className="text-slate-350">{LANGUAGE_NAME[lng]}</p>
    </section>
  );
};

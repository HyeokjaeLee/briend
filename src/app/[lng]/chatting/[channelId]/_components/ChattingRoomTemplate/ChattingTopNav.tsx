'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { RiArrowGoBackFill } from 'react-icons/ri';

import { CustomIconButton } from '@/components/atoms/CustomIconButton';
import { CustomTopHeader } from '@/components/atoms/CustomTopHeader';
import { Timer, type TimerProps } from '@/components/molecules/Timer';
import { ROUTES } from '@/routes/client';
import type { Payload } from '@/types/jwt';

interface ChattingTopNavProps
  extends Pick<TimerProps, 'onTimeout' | 'expires'> {
  otherName: string;
}

export const ChattingTopNav = ({
  otherName,
  ...timerProps
}: ChattingTopNavProps) => (
  <CustomTopHeader className="flex items-center justify-between gap-8">
    <div className="flex items-center gap-8">
      <CustomIconButton asChild variant="ghost">
        <Link href={ROUTES.HOME.pathname}>
          <RiArrowGoBackFill className="size-6 text-slate-900" />
        </Link>
      </CustomIconButton>
      <h1 className="text-lg font-semibold">{otherName}</h1>
    </div>
    <Timer {...timerProps} />
  </CustomTopHeader>
);

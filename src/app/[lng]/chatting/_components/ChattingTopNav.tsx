'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { RiArrowGoBackFill } from 'react-icons/ri';

import { CustomIconButton } from '@/components/CustomIconButton';
import { CustomTopHeader } from '@/components/CustomTopHeader';
import { ROUTES } from '@/routes/client';
import type { Payload } from '@/types/jwt';

type ChattingTopNavProps = Pick<
  Payload.ChannelToken,
  'guestNickname' | 'hostId' | 'hostNickname'
>;

export const ChattingTopNav = ({
  hostId,
  hostNickname,
  guestNickname,
}: ChattingTopNavProps) => {
  const session = useSession();

  return (
    <CustomTopHeader className="flex items-center gap-8">
      <CustomIconButton asChild variant="ghost">
        <Link href={ROUTES.CHATTING_LIST.pathname}>
          <RiArrowGoBackFill className="size-6 text-slate-50" />
        </Link>
      </CustomIconButton>
      <h1 className="text-lg font-semibold">
        {session.data?.user.id === hostId ? guestNickname : hostNickname}
      </h1>
    </CustomTopHeader>
  );
};

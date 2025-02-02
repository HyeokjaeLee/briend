'use client';

import { Suspense } from 'react';

import { trpc } from '@/app/trpc';

import { NoNickNameModal } from './_components/NoNickNameModal';

interface JoinTemplateProps {
  inviteToken: string;
}

export const JoinTemplate = ({ inviteToken }: JoinTemplateProps) => {
  const [data] = trpc.chat.verfiyInviteToken.useSuspenseQuery({
    inviteToken,
  });

  return (
    <Suspense>
      <NoNickNameModal exp={data.exp} inviteToken={inviteToken} />
    </Suspense>
  );
};

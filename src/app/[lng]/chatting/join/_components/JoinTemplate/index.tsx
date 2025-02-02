'use client';

import { getAuth } from 'firebase/auth';
import { decodeJwt } from 'jose';

import { Suspense } from 'react';

import type { JwtPayload } from '@/types/jwt';
import { assert } from '@/utils';

import { NoNickNameModal } from './_components/GuestModal';

interface JoinTemplateProps {
  inviteToken: string;
}

export const JoinTemplate = ({ inviteToken }: JoinTemplateProps) => {
  const { exp } = decodeJwt<JwtPayload.InviteToken>(inviteToken);

  const auth = getAuth();

  const userId = auth.currentUser?.uid;

  assert(userId);

  return (
    <Suspense>
      <NoNickNameModal exp={exp} inviteToken={inviteToken} userId={userId} />
    </Suspense>
  );
};

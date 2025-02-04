'use client';

import { getAuth } from 'firebase/auth';
import { decodeJwt } from 'jose';

import { Suspense, useEffect, useMemo } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { trpc } from '@/app/trpc';
import { useCustomRouter } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useGlobalStore } from '@/stores';
import type { JwtPayload } from '@/types/jwt';
import { assert, CustomError } from '@/utils';
import { createOnlyClientComponent, toast } from '@/utils/client';

import { GuestModal } from './_components/GuestModal';

interface JoinTemplateProps {
  inviteToken: string;
}

export const JoinTemplate = createOnlyClientComponent(
  ({ inviteToken }: JoinTemplateProps) => {
    const { hostUserId, exp } = useMemo(
      () => decodeJwt<JwtPayload.InviteToken>(inviteToken),
      [inviteToken],
    );

    const { currentUser } = getAuth();

    assert(currentUser);

    const { uid: userId, isAnonymous } = currentUser;

    if (userId === hostUserId)
      throw new CustomError({
        code: 'UNAUTHORIZED',
        message: 'Cannot join your own room',
      });

    const joinChatMutation = trpc.chat.joinChat.useMutation();

    const { mutate: mutateJoinChat } = joinChatMutation;

    const { t } = useTranslation('join-chat');

    const router = useCustomRouter();

    const hasSidePanel = useGlobalStore((state) => state.hasSidePanel);

    useEffect(() => {
      if (isAnonymous) return;

      mutateJoinChat({
        inviteToken,
        userId,
      });
    }, [inviteToken, isAnonymous, mutateJoinChat, userId]);

    useEffect(() => {
      if (!joinChatMutation.isSuccess) return;

      router.replace(
        ROUTES.CHATTING_ROOM.pathname({
          userId: joinChatMutation.data.hostUserId,
        }),
        {
          toSidePanel: hasSidePanel,
        },
      );

      if (hasSidePanel) {
        router.replace(ROUTES.FRIEND_LIST.pathname);
      }

      toast({
        message: t('start-chatting-toast-message'),
      });
    }, [
      hasSidePanel,
      joinChatMutation.data,
      joinChatMutation.isSuccess,
      router,
      t,
    ]);

    return isAnonymous ? (
      <Suspense>
        <GuestModal exp={exp} inviteToken={inviteToken} userId={userId} />
      </Suspense>
    ) : null;
  },
);

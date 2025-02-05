'use client';

import { getAuth } from 'firebase/auth';
import { decodeJwt } from 'jose';

import { Suspense, useEffect, useMemo } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { trpc } from '@/app/trpc';
import { DotLottie, LoadingTemplate } from '@/components';
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

    return (
      <>
        {joinChatMutation.isSuccess ? (
          <DotLottie
            className="m-auto max-w-96"
            loop={false}
            src="/assets/lottie/send-nickname.lottie"
            onCompleted={() => {
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
            }}
          />
        ) : (
          <LoadingTemplate />
        )}
        {isAnonymous ? (
          <Suspense>
            <GuestModal exp={exp} inviteToken={inviteToken} userId={userId} />
          </Suspense>
        ) : null}
      </>
    );
  },
);

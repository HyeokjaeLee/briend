'use client';

import { useEffect, useState } from 'react';
import { FcCollaboration, FcAdvertising } from 'react-icons/fc';
import { RiShareFill } from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/client';
import { UtilsQueryOptions } from '@/app/query-options/utils';
import { trpc } from '@/app/trpc';
import { BottomButton, CustomButton, DotLottie, QR, Timer } from '@/components';
import { useRealTimeDatabase } from '@/database/firebase/client';
import type { UserRealtimeData } from '@/database/firebase/type';
import { useCustomRouter, useUserData } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { assert, cn, CustomError, expToDate } from '@/utils';
import { toast, createOnlyClientComponent } from '@/utils/client';
import { useQuery } from '@tanstack/react-query';

import {
  INVITE_MESSAGE,
  INVITE_SHARE_MESSAGE,
  INVITE_TITLE,
} from '../_constants/invite-language-text';

interface InviteChatTemplateProps {
  inviteToken: string;
  isSidePanel?: boolean;
}

export const InviteChatTemplate = createOnlyClientComponent(
  ({ inviteToken, isSidePanel }: InviteChatTemplateProps) => {
    const [inviteTokenPayload] = trpc.chat.verfiyInviteToken.useSuspenseQuery(
      {
        inviteToken,
      },
      {
        retry: false,
      },
    );

    const url = ROUTES.JOIN_CHAT.url({
      lng: inviteTokenPayload.inviteeLanguage,
      searchParams: {
        inviteToken,
      },
    }).href;

    const { user } = useUserData();

    assert(user);

    const userId = user.id;

    const [connectedGuestId, setConnectedGuestId] = useState<string>();

    const { data } = useRealTimeDatabase<UserRealtimeData['chat']>(
      'onValue',
      `${userId}/chat`,
    );

    const utils = trpc.useUtils();

    useEffect(() => {
      if (!data) return;

      for (const [inviteeId, chat] of Object.entries(data)) {
        if (chat.inviteId === inviteTokenPayload.inviteId) {
          utils.friend.getFriendList.reset();

          return setConnectedGuestId(inviteeId);
        }
      }
    }, [data, inviteTokenPayload.inviteId, utils]);

    const expires = expToDate(inviteTokenPayload.exp);

    const { t } = useTranslation('invite-chat-qr');

    const handleExpiredToken = () => {
      toast({
        message: t('expired-toast-message'),
      });

      throw new CustomError({
        code: 'EXPIRED_CHAT',
      });
    };

    const { data: shortUrl, isFetched } = useQuery({
      ...UtilsQueryOptions.shortUrl(url),
      staleTime: 300_000,
      gcTime: 300_000,
    });

    const inviteUrl = shortUrl ?? url;

    const title = INVITE_TITLE[inviteTokenPayload.inviteeLanguage];

    const handleShare = () => {
      navigator.share({
        title,
        text: INVITE_SHARE_MESSAGE[inviteTokenPayload.inviteeLanguage],
        url: inviteUrl,
      });
    };

    const router = useCustomRouter();

    return (
      <article
        className={cn(
          'flex flex-1 flex-col p-2',
          isSidePanel && 'items-center',
        )}
      >
        <div className="flex flex-1 flex-col">
          <section className="flex-1 rotate-180 flex-col gap-2 flex-center">
            <h1 className="break-keep text-center text-xl font-bold">
              <FcCollaboration
                aria-hidden
                className="mb-1 mr-2 inline size-6"
              />
              {title}
            </h1>
            <p className="px-4 text-center text-sm text-slate-500">
              {INVITE_MESSAGE[inviteTokenPayload.inviteeLanguage]}
            </p>
          </section>
          {connectedGuestId ? (
            <DotLottie
              className="mx-auto max-w-80 flex-1"
              loop={false}
              src="/assets/lottie/receive-message.lottie"
              onCompleted={() => {
                router.replace(
                  ROUTES.CHATTING_ROOM.pathname({ userId: connectedGuestId }),
                  {
                    toSidePanel: isSidePanel,
                  },
                );

                if (isSidePanel) {
                  router.replace(ROUTES.FRIEND_LIST.pathname);
                }

                toast({
                  message: t('start-chatting-toast-message'),
                });
              }}
            />
          ) : (
            <section className="w-full flex-1 rotate-180 bg-white px-4 flex-center">
              <QR
                alt="invite-qr"
                href={inviteUrl}
                loading={!isFetched}
                size={150}
              />
            </section>
          )}
          <section className="flex-1 flex-col gap-2 flex-center">
            <h2 className="text-center text-xl font-bold text-slate-900">
              <FcAdvertising aria-hidden className="mb-1 mr-2 inline size-6" />
              {t('warning-message')}
            </h2>
            <p className="text-center text-slate-500">{t('notice-message')}</p>
          </section>
        </div>
        <Timer
          className="mx-auto"
          expires={expires}
          stop={!!connectedGuestId}
          onTimeout={handleExpiredToken}
        />
        {isSidePanel ? (
          <CustomButton
            className={cn(
              'mt-3',
              connectedGuestId && 'animate-fade-up animate-reverse',
            )}
            onClick={handleShare}
          >
            <RiShareFill className="size-7" /> {t('share-button-text')}
          </CustomButton>
        ) : (
          <BottomButton loading={!!connectedGuestId} onClick={handleShare}>
            <RiShareFill className="size-7" /> {t('share-button-text')}
          </BottomButton>
        )}
      </article>
    );
  },
);

'use client';

import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

import { useEffect, useState } from 'react';
import { FcCollaboration, FcAdvertising } from 'react-icons/fc';
import { RiShareFill } from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/client';
import { UtilsQueryOptions } from '@/app/query-options/utils';
import { trpc } from '@/app/trpc';
import { BottomButton, CustomButton, DotLottie, QR, Timer } from '@/components';
import { LANGUAGE } from '@/constants';
import { COLLECTIONS } from '@/database/firestore/type';
import { useAsyncError, useCustomRouter, useUserData } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { assert, cn, CustomError, expToDate } from '@/utils';
import { toast, createOnlyClientComponent } from '@/utils/client';
import { useQuery } from '@tanstack/react-query';

const INVITE_TITLE = {
  [LANGUAGE.KOREAN]: '채팅에 초대받았어요!',
  [LANGUAGE.ENGLISH]: 'You have been invited to chat!',
  [LANGUAGE.JAPANESE]: 'チャットに招待されました！',
  [LANGUAGE.CHINESE]: '您已被邀请加入聊天！',
  [LANGUAGE.THAI]: 'คุณได้รับการเชิญชวนไปที่สนทนา！',
  [LANGUAGE.VIETNAMESE]: 'Bạn đã được mời vào cuộc trò chuyện！',
};

const INVITE_MESSAGE = {
  [LANGUAGE.KOREAN]: 'QR 코드를 스캔하면 친구와 같은 언어로 채팅 할 수 있어요.',
  [LANGUAGE.ENGLISH]:
    'Scan the QR code to chat with your friend in the same language.',
  [LANGUAGE.JAPANESE]:
    'QR コードをスキャンして、同じ言語で友達とチャットできます。',
  [LANGUAGE.CHINESE]: '扫描二维码，与您的朋友用相同的语言聊天。',
  [LANGUAGE.THAI]: 'สแกน QR สำหรับการสนทนาด้วยภาษาที่เหมือนกันกับเพื่อนของคุณ',
  [LANGUAGE.VIETNAMESE]:
    'Quét mã QR để trò chuyện với bạn bè bằng cùng một ngôn ngữ.',
};

const INVITE_SHARE_MESSAGE = {
  [LANGUAGE.KOREAN]: '친구와 같은 언어로 채팅할 수 있어요.',
  [LANGUAGE.ENGLISH]: 'You can chat with your friend in the same language.',
  [LANGUAGE.JAPANESE]: '同じ言語で友達とチャットできます。',
  [LANGUAGE.CHINESE]: '您可以与您的朋友用相同的语言聊天。',
  [LANGUAGE.THAI]: 'คุณสามารถสนทนาด้วยภาษาที่เหมือนกันกับเพื่อนของคุณ',
  [LANGUAGE.VIETNAMESE]:
    'Bạn có thể trò chuyện với bạn bè bằng cùng một ngôn ngữ.',
};

interface InviteChatQrTemplateProps {
  inviteToken: string;
  isSidePanel?: boolean;
}

export const InviteChatQRTemplate = createOnlyClientComponent(
  ({ inviteToken, isSidePanel }: InviteChatQrTemplateProps) => {
    const [inviteTokenPayload] = trpc.chat.verfiyInviteToken.useSuspenseQuery(
      {
        inviteToken,
      },
      {
        retry: false,
      },
    );

    const url = ROUTES.JOIN_CHAT.url({
      lng: inviteTokenPayload.guestLanguage,
      searchParams: {
        inviteToken,
      },
    }).href;

    const { user } = useUserData();

    assert(user);

    const userId = user.id;

    const asyncError = useAsyncError();

    const [connectedGuestId, setConnectedGuestId] = useState<string>();

    useEffect(() => {
      const db = getFirestore();
      const chattingRoomsRef = collection(
        db,
        COLLECTIONS.USERS,
        userId,
        COLLECTIONS.CHATTING_ROOMS,
      );

      const filteredQuery = query(
        chattingRoomsRef,
        where('roomId', '==', inviteTokenPayload.roomId),
      );

      const unsubscribe = onSnapshot(
        filteredQuery,
        (snapshot) => {
          snapshot.docs.forEach((doc) => {
            setConnectedGuestId(doc.id);
          });
        },
        (error) => {
          asyncError({
            code: 'INTERNAL_FIRESTORE_ERROR',
            cause: error.cause,
            message: error.message,
          });
        },
      );

      return unsubscribe;
    }, [asyncError, inviteTokenPayload.roomId, userId]);

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

    const title = INVITE_TITLE[inviteTokenPayload.guestLanguage];

    const handleShare = () => {
      navigator.share({
        title,
        text: INVITE_SHARE_MESSAGE[inviteTokenPayload.guestLanguage],
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
              {INVITE_MESSAGE[inviteTokenPayload.guestLanguage]}
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

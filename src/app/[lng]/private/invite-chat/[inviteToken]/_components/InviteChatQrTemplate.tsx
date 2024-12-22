'use client';

import type { JWTPayload } from 'jose';

import { decodeJwt } from 'jose';

import { useEffect } from 'react';
import { FcAdvertising, FcCollaboration } from 'react-icons/fc';
import { RiShareFill } from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/client';
import { pusher } from '@/app/pusher/client';
import { UtilsQueryOptions } from '@/app/query-options/utils';
import { BottomButton, Timer, QR } from '@/components';
import { PUSHER_CHANNEL, PUSHER_EVENT, LANGUAGE } from '@/constants';
import { friendTable } from '@/database/indexed-db';
import { useCustomRouter } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { type JwtPayload } from '@/types/jwt';
import type { PusherMessage } from '@/types/pusher-message';
import { CustomError, ERROR_STATUS } from '@/utils';
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

interface InviteChatQrTemplateProps
  extends Pick<
    JwtPayload.InviteToken & JWTPayload,
    'exp' | 'hostId' | 'guestLanguage'
  > {
  url: string;
}

export const InviteChatQRTemplate = createOnlyClientComponent(
  ({ url, exp, hostId, guestLanguage }: InviteChatQrTemplateProps) => {
    const expires = new Date((exp ?? 0) * 1_000);

    const router = useCustomRouter();

    const { t } = useTranslation('invite-chat-qr');

    const handleExpiredToken = () => {
      toast({
        message: t('expired-toast-message'),
      });

      throw new CustomError({
        status: ERROR_STATUS.EXPIRED_CHAT,
      });
    };

    const { data: shortUrl, isFetched } = useQuery({
      ...UtilsQueryOptions.shortUrl(url),
      staleTime: 300_000,
      gcTime: 300_000,
    });

    const inviteUrl = shortUrl ?? url;

    useEffect(() => {
      const channel = pusher.subscribe(PUSHER_CHANNEL.WAITING);

      channel.bind(
        PUSHER_EVENT.WAITING(hostId),
        ({ friendToken }: PusherMessage.addFriend) => {
          const { userId } = decodeJwt<JwtPayload.FriendToken>(friendToken);

          if (!friendTable)
            throw new CustomError({
              status: ERROR_STATUS.UNKNOWN_VALUE,
              message: 'friend Table not found',
            });

          friendTable.put({
            friendToken,
            userId,
          });

          toast({
            message: t('start-chatting'),
          });

          router.replace(ROUTES.CHATTING_ROOM.pathname({ userId }));
        },
      );

      return () => {
        channel.unsubscribe();
      };
    }, [hostId, router, t]);

    const title = INVITE_TITLE[guestLanguage];

    return (
      <article className="flex flex-1 flex-col p-2">
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
              {INVITE_MESSAGE[guestLanguage]}
            </p>
          </section>
          <section className="w-full flex-1 rotate-180 bg-white px-4 flex-center">
            <QR
              alt="invite-qr"
              href={inviteUrl}
              loading={!isFetched}
              size={150}
            />
          </section>
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
          onTimeout={handleExpiredToken}
        />
        <BottomButton
          onClick={() => {
            navigator.share({
              title,
              text: INVITE_SHARE_MESSAGE[guestLanguage],
              url: inviteUrl,
            });
          }}
        >
          <RiShareFill className="size-7" /> 공유하기
        </BottomButton>
      </article>
    );
  },
);

'use client';

import { decodeJwt } from 'jose';

import { useCallback, useEffect } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { pusher } from '@/app/pusher/client';
import { ChatQueryOptions } from '@/app/query-options/chat';
import { QR } from '@/components/molecules/QR';
import { Timer } from '@/components/molecules/Timer';
import { PUSHER_CHANNEL, PUSHER_EVENT } from '@/constants/channel';
import { LANGUAGE } from '@/constants/language';
import { IS_DEV } from '@/constants/public-env';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { ROUTES } from '@/routes/client';
import { chattingRoomTable } from '@/stores/chatting-db.';
import type { PusherType } from '@/types/api';
import { TOKEN_TYPE, type Payload } from '@/types/jwt';
import { CustomError, ERROR_STATUS } from '@/utils/customError';
import { toast } from '@/utils/toast';
import { useSuspenseQuery } from '@tanstack/react-query';

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

interface InviteChatQrTemplateProps {
  inviteToken: string;
}

export const InviteChatQRTemplate = ({
  inviteToken,
}: InviteChatQrTemplateProps) => {
  const {
    data: { payload, isExpired },
  } = useSuspenseQuery(
    ChatQueryOptions.verifyToken({
      token: inviteToken,
      tokenType: TOKEN_TYPE.INVITE,
    }),
  );

  const hostId = payload.hostId;

  const expires = new Date((payload.exp ?? 0) * 1_000);

  const router = useCustomRouter();

  const { t } = useTranslation('invite-chat-qr');

  const handleExpiredToken = useCallback(() => {
    toast({
      message: t('expired-toast-message'),
    });

    throw new CustomError({
      status: ERROR_STATUS.EXPIRED_CHAT,
    });
  }, [t]);

  useEffect(() => {
    if (isExpired) handleExpiredToken();
  }, [isExpired, handleExpiredToken]);

  useEffect(() => {
    const channel = pusher.subscribe(PUSHER_CHANNEL.WAITING);

    channel.bind(
      PUSHER_EVENT.WAITING(hostId),
      ({ channelToken }: PusherType.joinChat) => {
        const { channelId } = decodeJwt<Payload.ChannelToken>(channelToken);

        chattingRoomTable.add({
          token: channelToken,
          id: channelId,
        });

        toast({
          message: t('start-chatting'),
        });

        router.replace(ROUTES.CHATTING_ROOM.pathname({ channelId }));
      },
    );

    return () => {
      channel.unsubscribe();
    };
  }, [hostId, payload.language, router, t]);

  const { guestLanguage } = payload;

  const { href } = ROUTES.JOIN_CHAT.url({
    lng: guestLanguage,
    searchParams: {
      inviteToken,
    },
  });

  return (
    <article className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col">
        <section className="flex flex-1 rotate-180 flex-col items-center justify-center">
          <h1 className="break-keep text-center text-2xl font-bold">
            📨 {INVITE_TITLE[guestLanguage]}
          </h1>
          <p className="px-4 py-2 text-center text-slate-500">
            {INVITE_MESSAGE[guestLanguage]}
          </p>
        </section>
        <section className="flex w-full flex-1 rotate-180 items-center justify-center bg-white p-4">
          <QR alt="invite-qr" href={href} size={180} />
        </section>
        <section className="flex flex-1 flex-col items-center justify-center">
          {IS_DEV ? (
            <>
              DEV URL
              <a className="max-w-56 text-wrap text-xs" href={href}>
                {href}
              </a>
            </>
          ) : null}
          <p className="text-center text-slate-500">{t('notice-message')}</p>
        </section>
      </div>
      <div className="flex h-14 items-center justify-center border-t border-t-slate-200 bg-slate-100">
        <Timer expires={expires} onTimeout={handleExpiredToken} />
      </div>
    </article>
  );
};

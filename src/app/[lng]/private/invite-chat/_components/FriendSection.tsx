'use client';

import { nanoid } from 'nanoid';

import { useEffect, useState } from 'react';

import { QR } from '@/components/QR';
import { LANGUAGE } from '@/constants/language';
import { API_ROUTES } from '@/routes/api';
import { Skeleton } from '@radix-ui/themes';

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

interface FriendSectionProps {
  nickname: string;
  userId: string;
  language: LANGUAGE;
  emoji: string;
}

export const FriendSection = ({
  nickname,
  userId,
  language,
  emoji,
}: FriendSectionProps) => {
  const [friendLanguage, setFriendLanguage] = useState(LANGUAGE.ENGLISH);

  useEffect(() => setFriendLanguage(language), [language]);

  const inviteUrl = API_ROUTES.INVITE_CHAT.url({
    searchParams: {
      emoji,
      language: friendLanguage,
      nickname,
      'chat-id': nanoid(),
      'user-id': userId,
    },
  });

  return (
    <section className="relative flex flex-1 rotate-180 flex-col gap-5 p-5 text-slate-900">
      <h2 className="text-2xl font-bold">🎉 {INVITE_TITLE[friendLanguage]}</h2>
      <div className="mx-auto flex max-w-96 flex-1 flex-col items-center justify-center gap-5">
        <Skeleton>
          <QR className="size-40" href={inviteUrl.toString()} />
        </Skeleton>
        <p className="mt-10 break-keep text-center text-xl">
          {INVITE_MESSAGE[friendLanguage]}
        </p>
      </div>
    </section>
  );
};

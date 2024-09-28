import { useCookies } from 'react-cookie';

import { QR } from '@/components/QR';
import { COOKIES } from '@/constants/cookies-key';
import { LANGUAGE } from '@/constants/language';
import { IS_DEV } from '@/constants/public-env';
import { ROUTES } from '@/routes/client';

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

interface InviteQRSectionProps {
  expires: Date;
  hostId: string;
  language: LANGUAGE;
}

export const InviteQRSection = ({
  expires,
  hostId,
  language,
}: InviteQRSectionProps) => {
  const [cookies] = useCookies([COOKIES.ACCESS_TOKEN]);

  const accessToken = cookies[COOKIES.ACCESS_TOKEN];

  const qrUrl = ROUTES.INVITED_CHAT_ENTER.url({
    dynamicPath: { hostId },
    searchParams: {
      expires: String(expires.getTime()),
      accessToken,
    },
  });

  qrUrl.pathname = `/${language}${qrUrl.pathname}`;

  const { href } = qrUrl;

  return (
    <section className="flex flex-1 rotate-180 flex-col items-center justify-between gap-4">
      <h1 className="break-keep text-2xl font-bold">
        📨 {INVITE_TITLE[language]}
      </h1>
      <QR href={href} />
      <p className="break-keep rounded-lg bg-slate-100 px-4 py-2 text-lg">
        📢 {INVITE_MESSAGE[language]}
      </p>
      {IS_DEV ? (
        <a className="absolute top-1/2 rotate-180 text-center" href={href}>
          {href}
        </a>
      ) : null}
    </section>
  );
};

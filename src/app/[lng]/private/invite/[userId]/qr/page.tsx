import { getTranslation } from '@/app/i18n/server';
import { QR } from '@/components/molecules/QR';
import { LANGUAGE } from '@/constants/language';
import { ROUTES } from '@/routes/client';

import { ShareButton } from './_components/ShareButton';

interface InviteQrPageProps {
  params: Promise<{
    userId: string;
    lng: LANGUAGE;
  }>;
  searchParams: Promise<{
    lng: LANGUAGE;
  }>;
}

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

const InviteQrPage = async (props: InviteQrPageProps) => {
  const { userId, lng } = await props.params;
  const { lng: guestLanguage } = await props.searchParams;

  const connectingFriendUrl = ROUTES.CONNECTING_FRIEND.url({
    dynamicPath: {
      userId,
    },
    lng: guestLanguage,
  });

  const { t } = await getTranslation('invite-qr', lng);

  return (
    <article className="flex flex-1 flex-col">
      <header className="flex flex-1 rotate-180 flex-col items-center justify-center">
        <h1 className="break-keep text-center text-2xl font-bold">
          📨 {INVITE_TITLE[guestLanguage]}
        </h1>
        <p className="px-4 py-2 text-center text-slate-500">
          {INVITE_MESSAGE[guestLanguage]}
        </p>
      </header>
      <div className="m-auto rounded-md bg-white p-5">
        <QR alt="invite-qr" href={connectingFriendUrl.href} size={180} />
      </div>
      <footer className="flex flex-1 flex-col items-center justify-center">
        <p className="text-center text-slate-500">{t('notice-message')}</p>
      </footer>
      <ShareButton />
    </article>
  );
};

export default InviteQrPage;

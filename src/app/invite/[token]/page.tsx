'use client';

import { Clock } from 'react-feather';

import { LeftTimer } from '@/components/LeftTimer';
import { LANGUAGE, PATH } from '@/constants';
import { decodeChattingRoomToken } from '@/utils';

import { InviteQR } from './components/InviteQR';
import { useCheckJoin } from './hooks/useCheckJoin';
import { useCheckToken } from './hooks/useCheckToken';

interface InviteQrPageProps {
  params: {
    token: string;
  };
}

const InviteQrPage = ({ params: { token } }: InviteQrPageProps) => {
  const decodedToken = decodeChattingRoomToken(token);

  useCheckToken(decodedToken);

  if (!decodedToken) throw new Error('Invalid token');

  const { guestLanguage, endAt, hostId, guestName } = decodedToken;

  useCheckJoin({
    hostId,
    guestName,
  });

  const text = {
    [LANGUAGE.KOREAN]: {
      title: '채팅 초대',
      description: 'QR을 스캔하면 설치 없이 한국어로 저와 대화할 수 있어요.',
      time: '이 채팅은 제한 시간동안만 유지되요.',
    },
    [LANGUAGE.ENGLISH]: {
      title: 'Invite to chat',
      description:
        'Scan the QR and you can talk to me in English without installation.',
      time: 'This chat will only last for a limited time.',
    },
    [LANGUAGE.JAPANESE]: {
      title: 'チャット招待',
      description:
        'QRをスキャンすると、インストールなしで日本語で私と会話ができます。',
      time: 'このチャットは制限時間内のみ維持されます。',
    },
  }[guestLanguage];

  return (
    <main className="flex flex-col items-center max-w-3xl justify-center m-auto p-page gap-4 min-h-page">
      <h1 className="font-bold text-3xl mb-9">🙌 {text.title}</h1>
      <InviteQR token={token} />
      {process.env.NODE_ENV === 'development' ? (
        <a
          target="_blank"
          href={`${process.env.NEXT_PUBLIC_BASE_URL}${PATH.CHAT}/${token}`}
        >
          개발자 미리보기
        </a>
      ) : null}
      <h2 className="text-lg font-bold">{text.description}</h2>
      <section className="flex flex-col gap-1 items-center font-medium">
        {text.time}
        <div className="flex gap-2 items-center">
          <Clock /> <LeftTimer endAt={endAt} className="text-lg" />
        </div>
      </section>
    </main>
  );
};

export default InviteQrPage;

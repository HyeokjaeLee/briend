'use client';

import { Clock } from 'react-feather';

import { LeftTimer } from '@/components/LeftTimer';
import { LANGUAGE_PACK } from '@/constants';
import { decodeChattingRoomToken } from '@/utils';

import { DevPreviewLink } from './components/DevPreviewLink';
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

  const { guestLanguage, exp, hostId, guestName } = decodedToken;

  useCheckJoin({
    hostId,
    guestName,
  });

  return (
    <main className="flex flex-col items-center max-w-3xl justify-center m-auto p-page gap-4 min-h-page">
      <h1 className="font-bold text-3xl mb-9">
        🙌 {LANGUAGE_PACK.INVAITE_CHATTING_ROOM_TITLE[guestLanguage]}
      </h1>
      <InviteQR token={token} />
      <DevPreviewLink token={token} />
      <h2 className="text-lg font-bold">
        {LANGUAGE_PACK.INVITE_CHATTING_ROOM_DESCRIPTION[guestLanguage]}
      </h2>
      <section className="flex flex-col gap-1 items-center font-medium">
        <LeftTimer endAt={new Date(exp * 1000)} />
        {LANGUAGE_PACK.INVITE_CHATTING_ROOM_TIME_LIMIT[guestLanguage]}
      </section>
    </main>
  );
};

export default InviteQrPage;

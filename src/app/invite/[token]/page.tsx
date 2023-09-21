'use client';

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
    <article className="flex flex-col items-center max-w-3xl justify-center mx-auto gap-4 p-4 h-full">
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
    </article>
  );
};

export default InviteQrPage;

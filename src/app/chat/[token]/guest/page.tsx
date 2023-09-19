'use client';

import { MessageCircle } from 'react-feather';

import { LeftTimer } from '@/components/LeftTimer';
import { LANGUAGE_PACK } from '@/constants';
import { decodeChattingRoomToken } from '@/utils';
import { Button } from '@hyeokjaelee/pastime-ui';

import type { ChatPageProps } from '../page';

const InviteGuestPage = ({ params: { token } }: ChatPageProps) => {
  const decodedToken = decodeChattingRoomToken(token);

  if (!decodedToken) throw new Error('Invalid token');

  const { hostName, guestLanguage } = decodedToken;

  const isExpired = new Date(decodedToken.exp * 1000) < new Date();

  return (
    <main className="flex flex-col items-center max-w-3xl justify-center m-auto p-page min-h-page gap-4">
      <section className="flex flex-col items-center justify-center gap-1">
        <h1 className="font-bold text-2xl">
          👋 {LANGUAGE_PACK.CHATTING_ROOM_GUEST_TITLE[guestLanguage]}
        </h1>
        <p>
          {LANGUAGE_PACK.CHATTING_ROOM_GUEST_DESCRIPTION[guestLanguage](
            hostName,
          )}
        </p>
      </section>
      <section className="flex flex-col items-center">
        <LeftTimer endAt={new Date(decodedToken.exp * 1000)} />
        {LANGUAGE_PACK.INVITE_CHATTING_ROOM_TIME_LIMIT[guestLanguage]}
      </section>
      <Button
        icon={<MessageCircle size="1.2em" />}
        onClick={() => {
          window.location.href = `/chat/${token}`;
        }}
        disabled={isExpired}
      >
        {LANGUAGE_PACK.CHATTING_ROOM_GUEST_BUTTON[guestLanguage]}
      </Button>
    </main>
  );
};

export default InviteGuestPage;

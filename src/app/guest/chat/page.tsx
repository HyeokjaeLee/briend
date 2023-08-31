'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

import { ChattingList, SendMessageForm } from '@/components';
import { LANGUAGE } from '@/constants';
import { useCreateSocketRoom, useConnetSocketRoom } from '@/hooks';

const isLanguage = (lang: string): lang is LANGUAGE =>
  Object.values(LANGUAGE).includes(lang as LANGUAGE);

const ChatPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') ?? '';
  const user = searchParams?.get('user') ?? '';
  const lang = searchParams?.get('lang') ?? '';

  const { isRoomCreated } = useCreateSocketRoom(id);
  const { isConnected, room } = useConnetSocketRoom({
    isRoomCreated,
    id,
  });

  const isLangReady = isLanguage(lang);

  return isConnected && isLangReady ? (
    <main className="relative">
      <ChattingList id={id} user={user} room={room} language={lang} />
      <SendMessageForm id={id} user={user} language={lang} />
    </main>
  ) : null;
};

export default ChatPage;

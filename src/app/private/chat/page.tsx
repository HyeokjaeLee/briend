'use client';

import React from 'react';

import { ChattingList, SendMessageForm } from '@/components';
import { LANGUAGE } from '@/constants';
import { useCreateSocketRoom, useConnetSocketRoom } from '@/hooks';
import { useAuthStore } from '@/store/authStore';

const ChatPage = () => {
  const [id, user] = useAuthStore((state) => [state.id, state.userName]);
  const { isRoomCreated } = useCreateSocketRoom(id);

  const { isConnected, room } = useConnetSocketRoom({
    isRoomCreated,
    id,
  });

  return isConnected ? (
    <main className="relative">
      <ChattingList
        id={id}
        user={user}
        room={room}
        language={LANGUAGE.KOREAN}
      />
      <SendMessageForm id={id} user={user} language={LANGUAGE.KOREAN} />
    </main>
  ) : null;
};

export default ChatPage;

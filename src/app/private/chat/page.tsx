'use client';

import jwt from 'jsonwebtoken';
import PusherJs from 'pusher-js';
import { shallow } from 'zustand/shallow';

import React, { useEffect } from 'react';

import { ChattingList, SendMessageForm } from '@/components';
import { LANGUAGE } from '@/constants';
import { useCreateSocketRoom, useConnetSocketRoom } from '@/hooks';
import { useAuthStore } from '@/store/authStore';

const ChatPage = () => {
  const [id, user] = useAuthStore(
    (state) => [state.id, state.userName],
    shallow,
  );
  const { isRoomCreated } = useCreateSocketRoom(id);

  const { isConnected, room } = useConnetSocketRoom({
    isRoomCreated,
    id,
  });

  useEffect(() => {
    const { NEXT_PUBLIC_PUSHER_KEY } = process.env;
    if (id && NEXT_PUBLIC_PUSHER_KEY) {
      const pusher = new PusherJs(NEXT_PUBLIC_PUSHER_KEY, {
        cluster: 'ap3',
      });

      const channel = pusher.subscribe('message');
      channel.bind(id, (data) => {
        alert(JSON.stringify(data));
      });
    }
  }, [id]);

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

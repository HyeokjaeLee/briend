'use client';

import axios from 'axios';

import React from 'react';

import { useCreateSocketRoom, useConnetSocketRoom } from '@/hooks';
import { useChattingList } from '@/hooks/useChattingList';
import { useAuthStore } from '@/store/authStore';
import { Button, Textarea, useToast } from '@hyeokjaelee/pastime-ui';

const ChatPage = () => {
  const [id, user] = useAuthStore((state) => [state.id, state.userName]);
  const { isRoomCreated } = useCreateSocketRoom(id);

  const { isConnected, room } = useConnetSocketRoom({
    isRoomCreated,
    id,
  });

  const { chattingList } = useChattingList({ room, id, user });
  const { toast } = useToast();

  return isConnected ? (
    <main>
      <ul>
        {chattingList.map((chatting, index) => (
          <li key={index}>
            {chatting.isMine ? '나' : chatting.user}: {chatting.message}
          </li>
        ))}
      </ul>
      <Textarea>
        <Button
          onClick={() => {
            if (isConnected) {
              axios.post(
                '/api/chat',
                {
                  user,
                  message: '안녕하세요',
                },
                {
                  headers: {
                    Authorization: id,
                  },
                },
              );

              toast({
                message: '전송되었습니다.',
              });
            }
          }}
        >
          전송
        </Button>
      </Textarea>
    </main>
  ) : (
    <></>
  );
};

export default ChatPage;

'use client';

import { Dexie } from 'dexie';

import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { pusher } from '@/app/pusher/client';
import { PUSHER_CHANNEL, PUSHER_EVENT } from '@/constants/channel';
import { COOKIES } from '@/constants/cookies-key';
import { API_ROUTES } from '@/routes/api';
import type { PusherType } from '@/types/api';
import type { Payload } from '@/types/jwt';
import { useMutation } from '@tanstack/react-query';

interface ChattingListProps {}

export const ChattingList = ({}: ChattingListProps) => {
  const [cookies] = useCookies([COOKIES.USER_ID]);

  const userId = cookies['user-id'];

  const receiveMessageMutation = useMutation({
    mutationFn: API_ROUTES.RECEIVE_MESSAGE,
  });

  const mutateReceiveMessage = receiveMessageMutation.mutate;

  useEffect(() => {
    if (!userId) return;

    const channel = pusher.subscribe(
      PUSHER_CHANNEL.CHATTING(hostId, channelId),
    );

    console.log(PUSHER_CHANNEL.CHATTING(hostId, channelId));

    // presence 채널 이벤트 바인딩
    channel.bind('pusher:subscription_succeeded', (members: any) => {
      // 초기 접속자 목록
      console.log('현재 접속자:', members);
    });

    channel.bind('pusher:member_added', (member: any) => {
      // 새로운 유저가 접속했을 때
      console.log('새로운 접속자:', member);
    });

    channel.bind('pusher:member_removed', (member: any) => {
      // 유저가 나갔을 때
      console.log('접속 종료:', member);
    });

    channel.bind(
      PUSHER_EVENT.CHATTING_SEND_MESSAGE(userId),
      ({ id, message }: PusherType.sendMessage) => {
        mutateReceiveMessage({
          channelToken,
          message,
          id,
        });
      },
    );

    return () => {
      channel.unsubscribe();
    };
  }, [mutateReceiveMessage, userId]);

  return (
    <ul>
      <li>ss</li>
    </ul>
  );
};

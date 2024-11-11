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

const db = new Dexie('ChattingHistoryDB');

interface ChattingListProps
  extends Pick<Payload.ChannelToken, 'hostId' | 'channelId'> {
  channelToken: string;
}

export const ChattingList = ({
  hostId,
  channelId,
  channelToken,
}: ChattingListProps) => {
  db.version(1).stores({
    chatMessages: '++id, message, userID, translatedMessage',
  });

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
  }, [channelId, channelToken, hostId, mutateReceiveMessage, userId]);

  return (
    <ul>
      <li>ss</li>
    </ul>
  );
};

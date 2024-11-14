'use client';

import { Dexie } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

import { useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';

import { pusher } from '@/app/pusher/client';
import { Lottie } from '@/components/atoms/Lottie';
import { PUSHER_CHANNEL, PUSHER_EVENT } from '@/constants/channel';
import { COOKIES } from '@/constants/cookies-key';
import { API_ROUTES } from '@/routes/api';
import { chattingMessageTable, chattingRoomTable } from '@/stores/chatting-db.';
import type { PusherType } from '@/types/api';
import type { Payload } from '@/types/jwt';
import { cn } from '@/utils/cn';
import { createOnlyClientComponent } from '@/utils/createOnlyClientComponent';
import NewLottie from '@assets/lottie/new.json';
import { useMutation } from '@tanstack/react-query';
interface ChattingListProps {
  channelId: string;
  myId: string;
}

export const ChattingList = createOnlyClientComponent(
  ({ channelId, myId }: ChattingListProps) => {
    //TODO: 아이폰은 한번에 많이 랜더링하면 터지니까 무한스크롤 처럼 구현해야함
    const messages = useLiveQuery(
      () =>
        chattingMessageTable
          .where('chattingRoomId')
          .equals(channelId)
          .sortBy('timestamp'),
      [channelId],
      'loading',
    );

    const lastMessageId = useRef('');

    const isLoading = messages === 'loading';

    useEffect(() => {
      if (isLoading) return;

      if (messages.length) {
        const lastMessage = messages[messages.length - 1];

        lastMessageId.current = lastMessage.id;
      }
    }, [isLoading, messages]);

    if (isLoading) return null;

    return (
      <ul className="mx-2 my-7 flex flex-col gap-2">
        {messages.map((data, index) => {
          const isMine = index % 5 === 0; //data.fromUserId === myId;
          const isBeforeFromOther = index % 5 === 1;
          //messages[index - 1]?.fromUserId !== data.fromUserId;

          const isLastNewMessage =
            messages.length - 1 === index && lastMessageId.current !== data.id;

          return (
            <li key={data.id}>
              {isBeforeFromOther ? <div className="size-2 bg-red-500" /> : null}
              <article
                className={cn(
                  'relative max-w-[90%] w-fit px-3 py-2 rounded-b-xl whitespace-pre-wrap',
                  {
                    'animate-fade-up animate-duration-300': isLastNewMessage,
                    'bg-zinc-300 ml-auto rounded-tl-xl': isMine,
                    'bg-blue-300 rounded-tr-xl': !isMine,
                  },
                )}
              >
                {data.message}
                {isLastNewMessage ? (
                  <div
                    className={cn('absolute -bottom-40 w-52 overflow-visible', {
                      'left-0': !isMine,
                      'right-0': isMine,
                    })}
                  >
                    <Lottie data={NewLottie} loop={false} sizing="contain" />
                  </div>
                ) : null}
              </article>
            </li>
          );
        })}
      </ul>
    );
  },
);

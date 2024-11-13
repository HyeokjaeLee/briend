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
import { createOnlyClientComponent } from '@/utils/createOnlyClientComponent';
import { useLiveQuery } from 'dexie-react-hooks';
import { chattingMessageTable, chattingRoomTable } from '@/stores/chatting-db.';
import { cn } from '@/utils/cn';

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

    if (messages === 'loading') return null;

    return (
      <ul className="flex flex-col gap-2 mx-2 my-7">
        {messages.map((data, index) => {
          const isMine = index % 5 === 0; //data.fromUserId === myId;
          const isBeforeFromOther = index % 5 === 1;
          //messages[index - 1]?.fromUserId !== data.fromUserId;

          return (
            <li key={data.id}>
              {isBeforeFromOther ? (
                <div className="h-2 w-2 bg-red-500" />
              ) : null}
              <article
                className={cn(
                  'relative max-w-[90%] w-fit px-3 py-2 rounded-b-xl whitespace-pre-wrap',
                  {
                    'bg-zinc-300 ml-auto rounded-tl-xl': isMine,
                    'bg-blue-300 rounded-tr-xl': !isMine,
                  },
                )}
              >
                {data.message}
              </article>
            </li>
          );
        })}
      </ul>
    );
  },
);

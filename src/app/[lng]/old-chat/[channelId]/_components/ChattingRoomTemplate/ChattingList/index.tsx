'use client';

import type { Channel } from 'pusher-js';

import { useLiveQuery } from 'dexie-react-hooks';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import reactScroll from 'react-scroll';

import { PUSHER_EVENT } from '@/constants/channel';
import { SELECTOR } from '@/constants/selector';
import type { ChattingMessage } from '@/stores/chatting-db.';
import { chattingMessageTable } from '@/stores/chatting-db.';
import type { PusherMessage } from '@/types/pusher-message';
import { createOnlyClientComponent } from '@/utils/createOnlyClientComponent';

import { ChattingListItem } from './ChattingListItem';

interface ChattingListProps {
  channelId: string;
  myId: string;
  channel?: Channel;
  otherEmoji: string;
  otherName: string;
  isMyLanguage: boolean;
}

const LAST_NEW_MESSAGE_ID = 'last-new-message';

export const ChattingList = createOnlyClientComponent(
  ({
    channelId,
    myId,
    channel,
    otherEmoji,
    otherName,
    isMyLanguage,
  }: ChattingListProps) => {
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

    const [sendingMessages, setSendingMessages] = useState<
      Map<string, ChattingMessage>
    >(new Map());

    const lastMessageId = useRef('');

    const isLoading = messages === 'loading';

    useEffect(() => {
      if (isLoading) return;

      if (messages.length) {
        setSendingMessages((prevMap) => {
          messages.forEach((message) => {
            if (message.state === 'sent') prevMap.set(message.id, message);
          });

          return prevMap;
        });
      }
    }, [isLoading, messages]);

    useEffect(() => {
      if (!channel) return;

      channel.bind(
        PUSHER_EVENT.CHATTING_SEND_MESSAGE(channelId),
        async (message: PusherMessage.sendMessage) => {
          const { id } = message;
          const sentMessage = await chattingMessageTable.get(id);

          const chattingMessageData: ChattingMessage = {
            ...message,
            state: 'receive',
            chattingRoomId: channelId,
          };

          if (sentMessage) chattingMessageTable.update(id, chattingMessageData);
          else chattingMessageTable.add(chattingMessageData);
        },
      );
    }, [channel, channelId]);

    useEffect(() => {
      if (isLoading) return;

      return () => {
        if (messages.length) {
          const lastMessage = messages[messages.length - 1];

          lastMessageId.current = lastMessage.id;
        }
      };
    }, [messages, channel, channelId, isLoading]);

    useLayoutEffect(() => {
      reactScroll.scroller.scrollTo(LAST_NEW_MESSAGE_ID, {
        smooth: true,
        containerId: SELECTOR.MAIN,
      });
    }, [messages]);

    if (isLoading) return null;

    return (
      <ul className="relative mx-2 my-4 flex flex-col gap-2">
        {messages.map((data, index) => {
          const isLastNewMessage =
            messages.length - 1 === index && lastMessageId.current !== data.id;

          return (
            <ChattingListItem
              key={data.id}
              hasSendingMessage={sendingMessages.has(data.id)}
              id={isLastNewMessage ? LAST_NEW_MESSAGE_ID : undefined}
              isMyLanguage={isMyLanguage}
              message={data}
              myId={myId}
              otherEmoji={otherEmoji}
              otherName={otherName}
              prevMessage={messages[index - 1]}
              onSendComplete={() => {
                sendingMessages.delete(data.id);
                setSendingMessages(new Map(sendingMessages));
              }}
            />
          );
        })}
      </ul>
    );
  },
);

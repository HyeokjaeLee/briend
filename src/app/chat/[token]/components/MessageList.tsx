'use client';

import React, { useEffect, useRef } from 'react';

import { useChattingDataStore } from '@/store/useChattingDataStore';

import { EmptyMessageTemplate } from './EmptyMessageTemplate';
import { Message } from './Message';
import { useReceiveChatting } from '../hooks/useReceiveChatting';
import { useTranslate } from '../hooks/useTranslate';

import type { PrevMessageInfo } from './Message';

export const MessageList = () => {
  useTranslate();

  const { messageList } = useReceiveChatting();

  const chattingRoom = useChattingDataStore((state) => state.chattingRoom);

  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    });
  }, [messageList]);

  if (!messageList || !chattingRoom) return null;

  const { userName } = chattingRoom;

  const messageCount = messageList.length;

  return messageCount ? (
    <section className="flex-1 overflow-auto">
      <ul className="max-w-4xl mx-auto w-full flex flex-col gap-3 my-5 px-4">
        {messageList.map((messageData, index) => {
          const { meta, message } = messageData;
          const { from } = meta;

          const isMine = from === userName;
          const [originalLanguage, translatedLanguage] = isMine
            ? [chattingRoom.userLanguage, chattingRoom.opponentLanguage]
            : [chattingRoom.opponentLanguage, chattingRoom.userLanguage];

          let prevMessageInfo: PrevMessageInfo | undefined;
          if (index) {
            const { meta } = messageList[index - 1];
            prevMessageInfo = {
              isMine: meta.from === userName,
              createdAt: meta.createdAt,
            };
          }

          const isLast = index === messageList.length - 1;

          return (
            <Message
              ref={isLast ? ref : undefined}
              prevMessageInfo={prevMessageInfo}
              key={index}
              userName={from}
              isMine={isMine}
              originalMessage={message[originalLanguage] ?? ''}
              translatedMessage={message[translatedLanguage]}
              createdAt={meta.createdAt}
              messageCount={messageCount}
            />
          );
        })}
      </ul>
    </section>
  ) : (
    <EmptyMessageTemplate />
  );
};

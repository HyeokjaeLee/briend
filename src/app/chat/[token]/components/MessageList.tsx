'use client';

import React from 'react';

import { useChattingDataStore } from '@/store/useChattingDataStore';

import { Message } from './Message';
import { useReceiveChatting } from '../hooks/useReceiveChatting';
import { useTranslate } from '../hooks/useTranslate';

import type { PrevMessageInfo } from './Message';

export const MessageList = () => {
  useTranslate();

  const { messageList } = useReceiveChatting();

  const chattingRoom = useChattingDataStore((state) => state.chattingRoom);

  if (!messageList || !chattingRoom) return null;

  const { userName } = chattingRoom;

  return (
    <ul className="max-w-4xl m-auto w-full min-h-page flex flex-col gap-3 my-5 px-4">
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

        return (
          <Message
            prevMessageInfo={prevMessageInfo}
            key={index}
            userName={from}
            isMine={isMine}
            originalMessage={message[originalLanguage] ?? ''}
            translatedMessage={message[translatedLanguage]}
            createdAt={meta.createdAt}
            messageCount={messageList.length}
          />
        );
      })}
    </ul>
  );
};

// TODO:
/**
 *  {chattingList.map((chatting, index) => {
        const isLast = index === chattingList.length - 1;
        return (
          <li key={index} ref={isLast ? ref : undefined} className="flex gap-2">
            <div className="whitespace-nowrap rounded-full bg-slate-500 w-11 h-11 font-black flex items-center justify-center text-xs text-white">
              {chatting.user}
            </div>
            <div className="font-semibold whitespace-pre-wrap rounded-e-2xl rounded-es-2xl bg-slate-200 shadow-md py-2 px-4 flex-1 break-all max-w-fit mt-5">
              {chatting.message?.[language]}
            </div>
          </li>
        );
      })}
 */

/**
       *   const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView();
  }, [messageList]);
       */

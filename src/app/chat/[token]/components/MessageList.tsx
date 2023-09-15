'use client';

import React from 'react';

import { useChattingRoomIndexDBStore } from '@/store/useChattingRoomIndexDBStore';

import { Message } from './Message';
import { useReceiveChatting } from '../hooks/useReceiveChatting';
import { useTranslate } from '../hooks/useTranslate';

export const MessageList = () => {
  useTranslate();

  const { messageList } = useReceiveChatting();

  const chattingRoom = useChattingRoomIndexDBStore(
    (state) => state.chattingRoom,
  );

  if (!messageList || !chattingRoom) return null;

  return (
    <ul className="max-w-4xl m-auto w-full min-h-page flex flex-col gap-2 my-5 px-4">
      {messageList.map((messageData, index) => {
        const { meta, message } = messageData;
        const { from } = meta;

        const isMine = from === chattingRoom?.userName;
        const [originalLanguage, translatedLanguage] = isMine
          ? [chattingRoom.userLanguage, chattingRoom.opponentLanguage]
          : [chattingRoom.opponentLanguage, chattingRoom.userLanguage];

        return (
          <Message
            key={index}
            userName={from}
            isMine={isMine}
            isHost={chattingRoom.isHost}
            originalMessage={message[originalLanguage] ?? ''}
            translatedMessage={message[translatedLanguage]}
          />
        );
      })}
    </ul>
  );
};

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
import { shallow } from 'zustand/shallow';

import React from 'react';
import { Send } from 'react-feather';

import { LANGUAGE_PACK } from '@/constants';
import { useChattingDataStore } from '@/store/useChattingDataStore';
import { useTempMessageStore } from '@/store/useTempMessageStore';
import { Button, Textarea } from '@hyeokjaelee/pastime-ui';

import { useSendMessage } from '../hooks/useSendMessage';

const LIMIT_MESSAGE_LENGTH = 100;

export const SendMessageForm = () => {
  const [messageText, setMessageText] = useTempMessageStore(
    (state) => [state.messageText, state.setMessageText],
    shallow,
  );

  const chattingRoom = useChattingDataStore((state) => state.chattingRoom);

  const isExpired = chattingRoom ? chattingRoom.endAt < new Date() : false;

  const isOpponentLooking = useTempMessageStore(
    (state) => state.isOpponentLooking,
  );

  const { sendMessage, isLoading } = useSendMessage();

  const messageLength = messageText.length;

  let placeholder;

  if (chattingRoom) {
    const { userLanguage } = chattingRoom;
    if (!isOpponentLooking) {
      placeholder =
        LANGUAGE_PACK.FRIEND_NOT_LOOKING_CHATTING_TOAST_PLACEHOLDER[
          userLanguage
        ];
    } else if (isExpired) {
      placeholder =
        LANGUAGE_PACK.EXPIRED_CHATTING_ROOM_PLACEHOLDER[userLanguage];
    }
  }

  return chattingRoom ? (
    <form
      className="w-full bottom-0 bg-zinc-600 dark:bg-zinc-900 flex items-end h-fit"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(messageText);
      }}
    >
      <div className="flex-1 m-auto p-2">
        <Textarea
          disabled={!!placeholder}
          label={
            messageLength
              ? `${messageLength} / ${LIMIT_MESSAGE_LENGTH}`
              : undefined
          }
          className="w-full"
          value={messageText}
          placeholder={placeholder}
          onChange={(e) => {
            e.preventInnerStateChange();
            if (e.value.length <= LIMIT_MESSAGE_LENGTH) setMessageText(e.value);
          }}
        />
      </div>
      <Button
        shape="sharp-corner"
        theme="unset"
        loading={isLoading}
        type="submit"
        className="h-full"
        disabled={!messageLength}
        icon={
          <Send
            className={`w-7 h-7 mt-1 mr-1 ${
              !messageLength
                ? 'text-zinc-500 dark:text-zinc-800'
                : 'text-zinc-50'
            }`}
          />
        }
      />
    </form>
  ) : null;
};

import { shallow } from 'zustand/shallow';

import React from 'react';
import { Send } from 'react-feather';

import { useTempMessageStore } from '@/store/useTempMessageStore';
import { Button, Textarea } from '@hyeokjaelee/pastime-ui';

import { useSendMessage } from '../hooks/useSendMessage';

const LIMIT_MESSAGE_LENGTH = 100;

export const SendMessageForm = () => {
  const [messageText, setMessageText] = useTempMessageStore(
    (state) => [state.messageText, state.setMessageText],
    shallow,
  );

  const { sendMessage, isLoading } = useSendMessage();

  const messageLength = messageText.length;

  return (
    <form
      className="fixed w-full bottom-0 bg-zinc-600 dark:bg-zinc-900 flex items-end h-fit"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(messageText);
      }}
    >
      <div className="flex-1 m-auto p-2">
        <Textarea
          label={
            messageLength
              ? `${messageLength} / ${LIMIT_MESSAGE_LENGTH}`
              : undefined
          }
          className="w-full"
          value={messageText}
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
  );
};

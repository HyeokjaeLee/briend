import { shallow } from 'zustand/shallow';

import React from 'react';
import { Send } from 'react-feather';

import { useTempMessageStore } from '@/store/useTempMessageStore';
import { Button, Textarea } from '@hyeokjaelee/pastime-ui';

import { useSendMessage } from '../hooks/useSendMessage';

export const SendMessageForm = () => {
  const [messageText, setMessageText] = useTempMessageStore(
    (state) => [state.messageText, state.setMessageText],
    shallow,
  );

  const { sendMessage, isLoading } = useSendMessage();

  return (
    <form
      className="sticky bottom-0 p-2 bg-slate-800 flex gap-3 items-end"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(messageText);
      }}
    >
      <Textarea
        className="flex-1"
        value={messageText}
        onChange={(e) => {
          e.preventInnerStateChange();
          setMessageText(e.value);
        }}
      />
      <Button icon={<Send />} loading={isLoading} type="submit" />
    </form>
  );
};

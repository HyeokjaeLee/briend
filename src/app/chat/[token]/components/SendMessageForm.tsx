'use client';

import React, { useState } from 'react';
import { Send } from 'react-feather';

import { Button, Textarea } from '@hyeokjaelee/pastime-ui';

import { useSendMessage } from '../hooks/useSendMessage';

export const SendMessageForm = () => {
  const [message, setMessage] = useState('');

  const { sendMessage, isLoading } = useSendMessage();

  return (
    <form
      className="sticky bottom-0 p-2 bg-slate-800 flex gap-3 items-end"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(message);
      }}
    >
      <Textarea
        className="flex-1"
        value={message}
        onChange={(e) => {
          e.preventInnerStateChange();
          setMessage(e.value);
        }}
      />
      <Button icon={<Send />} loading={isLoading} type="submit" />
    </form>
  );
};

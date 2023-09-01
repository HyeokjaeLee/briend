'use client';

import axios from 'axios';

import React, { useState } from 'react';
import { Send } from 'react-feather';

import type { LANGUAGE } from '@/constants';
import { UseChattingListParams } from '@/hooks';
import { Button, Textarea, useToast } from '@hyeokjaelee/pastime-ui';
import type { Chatting } from '@socket-api/chat';

interface SendMessageFormProps
  extends Pick<UseChattingListParams, 'id' | 'user'> {
  language: LANGUAGE;
}

export const SendMessageForm = ({
  id,
  user,
  language,
}: SendMessageFormProps) => {
  const { toast } = useToast();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form className="sticky bottom-0 p-2 bg-slate-800 flex gap-3 items-end">
      <Textarea
        className="flex-1"
        value={message}
        onChange={(e) => {
          e.preventInnerStateChange();
          setMessage(e.value);
        }}
      />
      <Button
        icon={<Send />}
        loading={isLoading}
        onClick={async () => {
          if (message && user) {
            setIsLoading(true);
            /**
         *     const { status } = await axios.post(
              '/api/chat',
              {
                message: {
                  [language]: message,
                },
                user,
                language,
              } satisfies Chatting,
              {                
                headers: {
                  Authorization: id,
                },
              },
            );
         */
            const status = 201;

            const { status: status2 } = await axios.post(
              '/api/message',
              {
                message: {
                  [language]: message,
                },
                user,
                language,
              } satisfies Chatting,
              {
                headers: {
                  id,
                },
              },
            );

            setIsLoading(false);

            switch (status) {
              case 201:
                return setMessage('');
              default:
                return toast({
                  message: '메세지 전송에 실패했습니다.',
                });
            }
          } else {
            return toast({
              type: 'warning',
              message: '메세지를 입력해주세요.',
            });
          }
        }}
      />
    </form>
  );
};

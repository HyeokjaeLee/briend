'use client';

import type { z } from 'zod';

import { nanoid } from 'nanoid';

import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { RiSendPlane2Line } from 'react-icons/ri';
import TextareaAutosize from 'react-textarea-autosize';

import { useTranslation } from '@/app/i18n/client';
import { trpc } from '@/app/trpc';
import { CustomIconButton } from '@/components';
import { MESSAGE_STATE, messageTable } from '@/database/indexed-db';
import { sendMessageSchema } from '@/schema/trpc/chat';
import { cn } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';

interface SendMessageFormProps {
  friendUserId: string;
}

export const SendMessageForm = ({ friendUserId }: SendMessageFormProps) => {
  const { t } = useTranslation('chatting');

  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      message: '',
      toUserId: friendUserId,
    },
  });

  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onMutate: () => {
      const tempId = nanoid();

      messageTable?.add({
        id: tempId,
        state: MESSAGE_STATE.SENT,
        toUserId: friendUserId,
        fromUserId: '',
        message: '',
        translatedMessage: '',
        timestamp: Date.now(),
      });

      return {
        tempId,
      };
    },
    onSuccess: ({}, _, { tempId }) => {},
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = form.handleSubmit((params) =>
    sendMessageMutation.mutate(params),
  );

  return (
    <form onSubmit={handleSubmit}>
      <section className="flex items-end gap-2">
        <div
          className={cn(
            'rounded-md border bg-gray-50 px-3.5 py-[12.5px] flex-center flex-1',
            'transition-colors duration-75 border-zinc-50 focus-within:border-zinc-200',
          )}
        >
          <TextareaAutosize
            {...form.register('message')}
            ref={(e) => {
              form.register('message').ref(e);
              textareaRef.current = e;

              if (e) e.focus();
            }}
            cacheMeasurements
            className="w-full resize-none bg-transparent outline-none hide-scrollbar"
            maxRows={4}
            placeholder={t('send-form-placeholder')}
            title="message-input"
          />
        </div>
        <CustomIconButton
          className="mb-[6.5px] rounded-full"
          size="3"
          title="send-message"
          type="submit"
        >
          <RiSendPlane2Line className="ml-1 size-6 animate-jump-in animate-duration-300" />
        </CustomIconButton>
      </section>
    </form>
  );
};

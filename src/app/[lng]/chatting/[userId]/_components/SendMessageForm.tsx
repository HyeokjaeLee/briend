'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { RiSendPlane2Line } from 'react-icons/ri';
import TextareaAutosize from 'react-textarea-autosize';
import type { z } from 'zod';

import { CustomIconButton } from '@/components';
import { useTranslation } from '@/configs/i18n/client';
import { trpc } from '@/configs/trpc';
import { chattingDB, MESSAGE_STATE } from '@/database/indexed';
import { sendMessageSchema } from '@/schema/trpc/chat';
import { assert, cn } from '@/utils';

interface SendMessageFormProps {
  receiverId: string;
}

export const SendMessageForm = ({ receiverId }: SendMessageFormProps) => {
  const { t } = useTranslation('chatting');

  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      message: '',
      receiverId,
    },
  });

  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onMutate: ({ message, receiverId }) => {
      const tempId = nanoid();

      chattingDB.messages.add({
        id: tempId,
        state: MESSAGE_STATE.SENT,
        message,
        translatedMessage: '',
        timestamp: Date.now(),
        isMine: true,
        userId: receiverId,
      });

      form.setValue('message', '');

      return {
        tempId,
      };
    },
    onSuccess: (
      { id, timestamp, translatedMessage },
      { message, receiverId },
      { tempId },
    ) => {
      chattingDB.messages.delete(tempId);

      chattingDB.messages.add({
        id,
        state: MESSAGE_STATE.RECEIVE,
        message,
        translatedMessage,
        timestamp,
        isMine: true,
        userId: receiverId,
      });
    },
    onError: (_error, _params, context) => {
      const tempId = context?.tempId;

      assert(tempId);

      chattingDB.messages.update(tempId, {
        state: MESSAGE_STATE.ERROR,
      });
    },
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
            'flex-center flex-1 rounded-md border bg-gray-50 px-3.5 py-[12.5px]',
            'border-zinc-50 transition-colors duration-75 focus-within:border-zinc-200',
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
            className="hide-scrollbar w-full resize-none bg-transparent outline-hidden"
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
          <RiSendPlane2Line className="animate-jump-in animate-duration-300 ml-1 size-6" />
        </CustomIconButton>
      </section>
    </form>
  );
};

'use client';

import type { useMessageForm } from '../_hooks/useMessageForm';

import { nanoid } from 'nanoid';
import { z } from 'zod';

import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { RiSendPlane2Line } from 'react-icons/ri';
import TextareaAutosize from 'react-textarea-autosize';

import { useTranslation } from '@/app/i18n/client';
import { CustomIconButton } from '@/components';
import { MESSAGE_STATE, messageTable } from '@/database/indexed-db';
import { useUserId } from '@/hooks';
import type { FriendPeer } from '@/stores/peer';
import type { MessageData, PeerData } from '@/types/peer-data';
import { MESSAGE_TYPE } from '@/types/peer-data';
import { assert, cn } from '@/utils';
import { toast } from '@/utils/client';
import { zodResolver } from '@hookform/resolvers/zod';

interface SendMessageFormProps {
  form: ReturnType<typeof useMessageForm>['form'];
  friendUserId: string;
  friendPeer: FriendPeer;
}

export const SendMessageForm = ({
  friendPeer,
  friendUserId,
}: SendMessageFormProps) => {
  const { t } = useTranslation('chatting');

  const messageSchema = z.object({
    message: z
      .string()
      .min(1, t('message-required'))
      .max(2_000, t('message-too-long'))
      .trim(),
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const myUserId = useUserId();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = form.handleSubmit(
    async ({ message }) => {
      assert(myUserId);

      const id = nanoid();

      const data: MessageData = {
        fromUserId: myUserId,
        message,
        timestamp: Date.now(),
        toUserId: friendUserId,
        translatedMessage: '',
      };

      await messageTable?.add({
        id,
        state: MESSAGE_STATE.SENT,
        ...data,
      });

      await friendPeer.connection?.send({
        id,
        type: MESSAGE_TYPE.MESSAGE,
        data,
      } satisfies PeerData);

      form.setValue('message', '');

      textareaRef.current?.focus();
    },
    (errors) => {
      const message = errors.message?.message;
      if (message)
        toast({
          message,
        });
    },
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
          disabled={!friendPeer.isConnected}
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

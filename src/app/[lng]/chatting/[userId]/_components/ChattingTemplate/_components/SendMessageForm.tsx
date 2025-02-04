'use client';

import { z } from 'zod';

import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { RiSendPlane2Line } from 'react-icons/ri';
import TextareaAutosize from 'react-textarea-autosize';

import { useTranslation } from '@/app/i18n/client';
import { CustomIconButton } from '@/components';
import { cn } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';

export const SendMessageForm = () => {
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = form.handleSubmit(async ({ message }) => {});

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

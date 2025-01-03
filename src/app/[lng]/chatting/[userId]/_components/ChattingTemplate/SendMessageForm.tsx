'use client';

import type { Form } from '../UserActionSection';

import { RiSendPlane2Fill, RiSendPlane2Line } from 'react-icons/ri';
import TextareaAutosize from 'react-textarea-autosize';

import { useTranslation } from '@/app/i18n/client';
import { CustomBottomNav, CustomIconButton } from '@/components';
import { cn } from '@/utils';

interface SendMessageFormProps {
  form: Form;
}

export const SendMessageForm = ({
  form: { handleSubmit, register },
}: SendMessageFormProps) => {
  const { t } = useTranslation('chatting');

  return (
    <CustomBottomNav className="border-t-0 bg-white p-3">
      <form onSubmit={handleSubmit(() => {})}>
        <section className="flex items-end gap-2">
          <div
            className={cn(
              'rounded-md border bg-gray-100 px-3.5 py-[12.5px] flex-center flex-1',
              'transition-colors duration-75 border-zinc-50 focus-within:border-zinc-200',
            )}
          >
            <TextareaAutosize
              {...register('message')}
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
          >
            <RiSendPlane2Line className="ml-1 size-6 animate-jump-in animate-duration-300" />
          </CustomIconButton>
        </section>
      </form>
    </CustomBottomNav>
  );
};

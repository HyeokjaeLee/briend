'use client';

import type { Form } from '.';

import { RiSendPlane2Fill } from 'react-icons/ri';
import TextareaAutosize from 'react-textarea-autosize';

import { CustomIconButton } from '@/components/atoms/CustomIconButton';
import { cn } from '@/utils/cn';

interface SendMessageFormProps {
  onChange?: (value: string) => void;
  form: Form;
}

export const SendMessageForm = ({
  onChange,
  form: { register },
}: SendMessageFormProps) => {
  return (
    <form>
      <section className="flex items-end gap-2">
        <div
          className={cn(
            'rounded-md border bg-white px-3.5 py-[12.5px] flex-center flex-1',
            'transition-colors duration-75 border-zinc-50 focus-within:border-zinc-200',
          )}
        >
          <TextareaAutosize
            {...register('message')}
            cacheMeasurements
            className="w-full resize-none bg-transparent outline-none hide-scrollbar"
            maxRows={4}
            title="message-input"
            onChange={(e) => onChange?.(e.target.value)}
          />
        </div>
        <CustomIconButton
          className="mb-[6.5px] rounded-full"
          size="3"
          title="send-message"
        >
          <RiSendPlane2Fill className="ml-1 size-6 animate-jump-in animate-duration-300" />
        </CustomIconButton>
      </section>
    </form>
  );
};

'use client';

import { RiSendPlane2Fill } from 'react-icons/ri';
import TextareaAutosize from 'react-textarea-autosize';

import { CustomBottomNav } from '@/components/atoms/CustomBottomNav';
import { CustomIconButton } from '@/components/atoms/CustomIconButton';
import { cn } from '@/utils/cn';

export const SendMessageForm = () => {
  return (
    <CustomBottomNav className="border-t-0 bg-slate-100 p-5">
      <form>
        <section className="flex items-end gap-2">
          <div
            className={cn(
              'rounded-md border bg-white px-3.5 py-[12.5px] flex-center flex-1',
              'transition-colors duration-75 border-zinc-50 focus-within:border-zinc-200',
            )}
          >
            <TextareaAutosize
              cacheMeasurements
              className="w-full resize-none bg-transparent outline-none hide-scrollbar"
              maxRows={4}
              title="message-input"
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
    </CustomBottomNav>
  );
};

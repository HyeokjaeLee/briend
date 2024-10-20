'use client';

import { z } from 'zod';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiLock2Fill, RiSendPlane2Fill } from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/client';
import { CustomBottomNav } from '@/components/CustomBottomNav';
import { CustomIconButton } from '@/components/CustomIconButton';
import { cn } from '@/utils/cn';
import { CustomError, ERROR } from '@/utils/customError';
import { zodResolver } from '@hookform/resolvers/zod';
import { DropdownMenu, TextArea } from '@radix-ui/themes';

const MAX_MESSAGE_LENGTH = 1000;
const DEFAULT_HEIGHT = 3.5;

interface ChattingBottomTextfieldProps {
  exp?: number;
}

export const ChattingBottomTextfield = ({
  exp,
}: ChattingBottomTextfieldProps) => {
  if (!exp) throw new CustomError(ERROR.EXPIRED_CHAT());

  const ref = useRef<HTMLTextAreaElement>(null);

  const isExpired = exp * 1_000 < Date.now();

  const formSchema = z.object({
    message: z.string().min(1).max(MAX_MESSAGE_LENGTH),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
  });

  const [height, setHeight] = useState(DEFAULT_HEIGHT);

  const message = form.watch('message');

  useEffect(() => {
    if (ref.current) {
      const { scrollHeight } = ref.current;

      let height = scrollHeight / 16 + 1;

      if (height !== DEFAULT_HEIGHT) {
        height += 0.125;
      }

      setHeight(height);
    }
  }, [message]);

  const { t } = useTranslation('chatting');

  return isExpired ? (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="absolute bottom-4 right-4">
        <CustomIconButton className="rounded-full" color="gray" size="4">
          <RiLock2Fill className="size-6" />
        </CustomIconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="p-4">
        <h3 className="mb-2 text-lg font-bold">{t('lock-title')}</h3>
        <p className="whitespace-pre">{t('lock-contents')}</p>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ) : (
    <CustomBottomNav className="pl-4 pr-3">
      <form className="flex gap-2 flex-center">
        <div className="relative flex-1">
          <TextArea
            {...form.register('message')}
            className={cn('rounded-xl px-1 min-h-14 py-2 size-full max-h-48')}
            color="gray"
            placeholder="메시지 입력"
            size="3"
            style={{
              height: `${height}rem`,
            }}
            variant="soft"
            onChange={(e) => {
              form.setValue('message', e.target.value);
            }}
          />
          <TextArea
            ref={ref}
            className="invisible absolute bottom-0 -z-50 h-14 min-h-14 w-full px-1 py-2"
            size="3"
            value={message}
          />
        </div>
        <div className="mt-auto h-14 flex-center">
          <CustomIconButton className="rounded-full" color="cyan" size="4">
            <RiSendPlane2Fill className="ml-1 size-6" />
          </CustomIconButton>
        </div>
      </form>
    </CustomBottomNav>
  );
};

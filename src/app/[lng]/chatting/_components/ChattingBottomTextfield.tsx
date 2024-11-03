'use client';

import { useSession } from 'next-auth/react';
import { z } from 'zod';

import { useLayoutEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiLock2Fill, RiSendPlane2Fill } from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/client';
import { CustomBottomNav } from '@/components/CustomBottomNav';
import { CustomIconButton } from '@/components/CustomIconButton';
import { API_ROUTES } from '@/routes/api';
import type { Payload } from '@/types/jwt';
import { CustomError, ERROR } from '@/utils/customError';
import { zodResolver } from '@hookform/resolvers/zod';
import { DropdownMenu, TextArea } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';

const MAX_MESSAGE_LENGTH = 1000;
const DEFAULT_HEIGHT = 3.5;

interface ChattingBottomTextfieldProps
  extends Pick<Payload.ChannelToken, 'guestId' | 'hostId'> {
  exp?: number;
  channelToken: string;
}

export const ChattingBottomTextfield = ({
  exp,
  channelToken,
  hostId,
  guestId,
}: ChattingBottomTextfieldProps) => {
  if (!exp) throw new CustomError(ERROR.EXPIRED_CHAT());

  const session = useSession();

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

  useLayoutEffect(() => {
    if (ref.current) {
      const { scrollHeight } = ref.current;

      let height = scrollHeight / 14 + 1;

      if (height !== DEFAULT_HEIGHT) {
        height += 0.125;
      }

      setHeight(height);
    }
  }, [message]);

  const { t } = useTranslation('chatting');

  const sendMessageMutation = useMutation({
    mutationFn: API_ROUTES.SEND_MESSAGE,
  });

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
    <CustomBottomNav className="border-none bg-slate-50 pb-3 pl-4 pr-3">
      <form
        className="flex gap-2 flex-center"
        onSubmit={form.handleSubmit(
          ({ message }) => {
            sendMessageMutation.mutate({
              channelToken,
              message,
              toUserId: session.data?.user.id === hostId ? guestId : hostId,
            });
          },
          () => {},
        )}
      >
        <div className="relative flex-1">
          <TextArea
            {...form.register('message')}
            className="h-14.4 max-h-32 min-h-14.4 w-full px-1 pb-2 pt-2.5"
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
            readOnly
            className="invisible fixed left-0 top-0 -z-50 h-14.4 min-h-14.4 w-full px-1 pb-2 pt-2.5"
            size="3"
            value={message}
            variant="soft"
          />
        </div>
        <div className="mt-auto h-14 flex-center">
          <CustomIconButton className="rounded-full" size="4">
            <RiSendPlane2Fill className="ml-1 size-6" />
          </CustomIconButton>
        </div>
      </form>
    </CustomBottomNav>
  );
};

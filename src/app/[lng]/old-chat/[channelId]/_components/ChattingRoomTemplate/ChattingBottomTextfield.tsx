'use client';

import type { Channel } from 'pusher-js';

import { z } from 'zod';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiLock2Fill, RiSendPlane2Fill } from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/client';
import { CustomBottomNav } from '@/components/atoms/CustomBottomNav';
import { CustomIconButton } from '@/components/atoms/CustomIconButton';
import { Timer, type TimerProps } from '@/components/molecules/Timer';
import { PUSHER_EVENT } from '@/constants/channel';
import { API_ROUTES } from '@/routes/api';
import { chattingMessageTable } from '@/stores/chatting-db.';
import { cn } from '@/utils/cn';
import { createId } from '@/utils/createId';
import { toast } from '@/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { DropdownMenu, TextArea } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';

const MAX_MESSAGE_LENGTH = 1000;
const DEFAULT_HEIGHT = 3.5;

interface ChattingBottomTextfieldProps
  extends Pick<TimerProps, 'onTimeout' | 'expires'> {
  isExpired: boolean;
  channelToken: string;
  otherId: string;
  myId: string;
  channel?: Channel;
  channelId: string;
}

export const ChattingBottomTextfield = ({
  isExpired,
  channelToken,
  otherId,
  myId,
  channel,
  channelId,
  expires,
  onTimeout,
}: ChattingBottomTextfieldProps) => {
  const ref = useRef<HTMLTextAreaElement>(null);

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

      let height = scrollHeight + 16;

      if (height !== DEFAULT_HEIGHT) {
        height += 0.125;
      }

      setHeight(height);
    }
  }, [message]);

  const { t } = useTranslation('chatting');

  const sendMessageMutation = useMutation({
    mutationFn: (args: { id: string; message: string }) =>
      API_ROUTES.SEND_MESSAGE({
        ...args,
        channelToken,
        fromUserId: myId,
      }),
    onMutate: (args) => {
      chattingMessageTable.add({
        ...args,
        chattingRoomId: channelId,
        fromUserId: myId,
        translatedMessage: '',
        timestamp: Date.now(),
        state: 'sent',
      });
    },
    onError: (_, { id }) => {
      chattingMessageTable.update(id, {
        state: 'error',
      });
    },
  });

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!channel) return setIsLive(false);

    channel.bind(
      PUSHER_EVENT.SUBSCRIPTION_SUCCEEDED,
      ({ members }: { members: object }) => {
        //TODO: 상대방이 다른 사람과 채널을 사용하고 있다면 구독 취소, 재요청 버튼 표시
        setIsLive(otherId in members);
      },
    );

    let memberRemovedTimeout: NodeJS.Timeout | null = null;

    channel.bind(PUSHER_EVENT.MEMBER_ADDED, ({ id }: { id: string }) => {
      if (id === otherId) {
        if (memberRemovedTimeout) {
          clearTimeout(memberRemovedTimeout);
          memberRemovedTimeout = null;
        } else {
          setIsLive(true);
          toast({
            message: '친구가 돌아왔어요!',
          });
        }
      }
    });

    channel.bind(PUSHER_EVENT.MEMBER_REMOVED, ({ id }: { id: string }) => {
      if (id === otherId) {
        memberRemovedTimeout = setTimeout(() => {
          setIsLive(false);
          toast({
            type: 'warning',
            message: '친구가 자리를 떠났어요!',
          });
          memberRemovedTimeout = null;
        }, 1_000);
      }
    });

    return () => {
      channel.unbind(PUSHER_EVENT.SUBSCRIPTION_SUCCEEDED);
      channel.unbind(PUSHER_EVENT.MEMBER_ADDED);
      channel.unbind(PUSHER_EVENT.MEMBER_REMOVED);
    };
  }, [channel, otherId]);

  const [isTimerDisplay, setIsTimerDisplay] = useState(false);

  return isExpired ? (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="sticky bottom-4 right-4 ml-auto mt-auto">
        <CustomIconButton className="rounded-full" color="gray" size="4">
          <RiLock2Fill className="size-6" />
        </CustomIconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="mb-4 p-4">
        <h3 className="mb-2 text-lg font-bold">{t('lock-title')}</h3>
        <p className="whitespace-pre">{t('lock-contents')}</p>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ) : (
    <CustomBottomNav className="border-none bg-slate-50 py-3 pl-4 pr-3">
      <div
        className={cn(
          'absolute -top-12 right-8 rounded-full bg-slate-100/80 px-4 py-1 backdrop-blur',
          isTimerDisplay ? 'animate-fade-up' : 'invisible',
        )}
      >
        <Timer
          expires={expires}
          onChangeLeftSeconds={(leftSeconds) => {
            if (leftSeconds < 600) {
              setIsTimerDisplay(true);
            }
          }}
          onTimeout={onTimeout}
        />
      </div>
      <form
        className="flex gap-2 flex-center"
        onSubmit={form.handleSubmit(
          ({ message }) =>
            sendMessageMutation.mutate({
              id: createId(),
              message,
            }),
          () => {},
        )}
      >
        <div className="relative flex-1">
          <TextArea
            {...form.register('message')}
            className="h-14.4 max-h-32 min-h-14.4 w-full px-1 pb-2 pt-2.5"
            placeholder={isLive ? '메시지 입력' : '상대방이 자리에 없어요'}
            size="3"
            style={{
              height,
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
          <CustomIconButton
            className="rounded-full"
            disabled={!isLive}
            size="4"
          >
            {isLive ? (
              <RiSendPlane2Fill className="ml-1 size-6 animate-jump-in animate-duration-300" />
            ) : (
              <RiLock2Fill className="size-6 animate-jump-in animate-duration-300" />
            )}
          </CustomIconButton>
        </div>
      </form>
    </CustomBottomNav>
  );
};

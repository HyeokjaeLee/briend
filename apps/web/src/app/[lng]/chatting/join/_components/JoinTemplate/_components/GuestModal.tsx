import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  DotLottie,
  Input,
  InputDecorator,
  Modal,
  Timer,
} from '@/components';
import { useTranslation } from '@/configs/i18n/client';
import { trpc } from '@/configs/trpc';
import { useCustomRouter } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useGlobalStore } from '@/stores';
import { cn, CustomError, expToDate } from '@/utils';
import { toast } from '@/utils/client';

interface NoNickNameModalProps {
  exp?: number;
  inviteToken: string;
}

const formSchema = z.object({
  nickname: z
    .string()
    .min(1, 'nickname-required')
    .max(20, 'nickname-max-length'),
});

export const GuestModal = ({ exp, inviteToken }: NoNickNameModalProps) => {
  const utils = trpc.useUtils();

  const joinChatMutation = trpc.chat.joinChat.useMutation({
    onSuccess: () => {
      utils.friend.list.invalidate();
    },
  });

  const isSuccess = joinChatMutation.isSuccess;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { t } = useTranslation('join-chat');

  const router = useCustomRouter();

  const hasSidePanel = useGlobalStore((state) => state.hasSidePanel);

  return (
    <Modal
      open
      className="max-w-96"
      header={
        <div>
          <Timer
            className={cn(isSuccess && 'animate-fade-down animate-reverse')}
            expires={expToDate(exp)}
            onTimeout={() => {
              throw new CustomError({
                code: 'EXPIRED_CHAT',
              });
            }}
          />
        </div>
      }
    >
      <section className="flex-center flex-col">
        {isSuccess ? (
          <DotLottie
            key="send-nickname"
            className="size-44"
            loop={false}
            src="/assets/lottie/send-nickname.lottie"
            onCompleted={() => {
              router.replace(
                ROUTES.CHATTING_ROOM.pathname({
                  userId: joinChatMutation.data.inviterId,
                }),
                {
                  toSidePanel: hasSidePanel,
                },
              );

              if (hasSidePanel) {
                router.replace(ROUTES.FRIEND_LIST.pathname);
              }

              toast({
                message: t('start-chatting-toast-message'),
              });
            }}
          />
        ) : (
          <DotLottie
            key="write"
            className="size-44"
            src="/assets/lottie/write.lottie"
          />
        )}
        <strong className="text-center text-xl font-semibold">
          {isSuccess ? t('join-soon') : t('chatting-invite')}
        </strong>
        <p
          className={cn(
            'mx-10 mb-8 text-center text-zinc-600',
            isSuccess && 'invisible',
          )}
        >
          {t('friend-nickname')}
        </p>
      </section>
      <form
        className="w-full"
        onSubmit={form.handleSubmit(({ nickname }) => {
          joinChatMutation.mutate({
            inviteToken,
            nickname,
          });
        })}
      >
        <InputDecorator
          message={t(form.formState.errors.nickname?.message ?? '')}
        >
          <Input
            {...form.register('nickname')}
            disabled={isSuccess || joinChatMutation.isPending}
            placeholder={t('nickname')}
          />
        </InputDecorator>
        <Button
          className={cn('mt-8 w-full')}
          loading={joinChatMutation.isPending || joinChatMutation.isSuccess}
          type="submit"
        >
          {t('start-chatting-button')}
        </Button>
      </form>
    </Modal>
  );
};

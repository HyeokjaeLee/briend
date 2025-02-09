import { z } from 'zod';

import { useForm } from 'react-hook-form';

import { useTranslation } from '@/app/i18n/client';
import { trpc } from '@/app/trpc';
import {
  CustomButton,
  DotLottie,
  Input,
  Modal,
  Timer,
  ValidationMessage,
} from '@/components';
import { useCustomRouter } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useGlobalStore } from '@/stores';
import { cn, CustomError, expToDate } from '@/utils';
import { toast } from '@/utils/client';
import { zodResolver } from '@hookform/resolvers/zod';

interface NoNickNameModalProps {
  exp?: number;
  inviteToken: string;
  userId: string;
}

const formSchema = z.object({
  nickname: z
    .string()
    .min(1, 'nickname-required')
    .max(20, 'nickname-max-length'),
});

export const GuestModal = ({
  exp,
  inviteToken,
  userId,
}: NoNickNameModalProps) => {
  const joinChatMutation = trpc.chat.joinChat.useMutation();

  const isSuccess = joinChatMutation.isSuccess;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { t } = useTranslation('join-chat');

  const router = useCustomRouter();

  const hasSidePanel = useGlobalStore((state) => state.hasSidePanel);

  return (
    <Modal open className="max-w-96">
      <Timer
        className={cn(isSuccess && 'animate-fade-down animate-reverse')}
        expires={expToDate(exp)}
        onTimeout={() => {
          throw new CustomError({
            code: 'EXPIRED_CHAT',
          });
        }}
      />
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
      <form
        className="w-full"
        onSubmit={form.handleSubmit(({ nickname }) => {
          joinChatMutation.mutate({
            inviteToken,
            nickname,
            userId,
          });
        })}
      >
        <Input
          {...form.register('nickname')}
          disabled={isSuccess || joinChatMutation.isPending}
          placeholder={t('nickname')}
        />
        <ValidationMessage
          message={t(form.formState.errors.nickname?.message ?? '')}
        />
        <CustomButton
          className={cn('mt-8 w-full')}
          loading={joinChatMutation.isPending || joinChatMutation.isSuccess}
          type="submit"
        >
          {t('start-chatting-button')}
        </CustomButton>
      </form>
    </Modal>
  );
};

import { z } from 'zod';

import { useForm } from 'react-hook-form';

import { trpc } from '@/app/trpc';
import { CustomButton, DotLottie, Input, Modal, Timer } from '@/components';
import { cn, CustomError, expToDate } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';

interface NoNickNameModalProps {
  exp?: number;
  inviteToken: string;
}

const formSchema = z.object({
  nickname: z.string().min(1).max(20, 'nickname-max-length'),
});

export const NoNickNameModal = ({ exp, inviteToken }: NoNickNameModalProps) => {
  const joinChatMutation = trpc.chat.joinChat.useMutation();

  const isSuccess = joinChatMutation.isSuccess;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

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
        />
      ) : (
        <DotLottie
          key="qfqwfq"
          className="size-44"
          src="/assets/lottie/write.lottie"
        />
      )}
      <strong className="text-center text-xl font-semibold">
        {isSuccess ? '곧 채팅에 참여해요!' : '채팅에 초대받았어요!'}
      </strong>
      <p
        className={cn(
          'mx-10 mb-8 text-center text-zinc-600',
          isSuccess && 'invisible',
        )}
      >
        친구에게 표시할 닉네임을 알려주세요!
      </p>
      <form
        className="w-full"
        onSubmit={form.handleSubmit((data) =>
          joinChatMutation.mutate({
            inviteToken,
          }),
        )}
      >
        <Input
          {...form.register('nickname')}
          disabled={isSuccess || joinChatMutation.isPending}
          placeholder="닉네임"
        />
        <CustomButton
          className={cn(
            'mt-8 w-full',
            isSuccess && 'animate-fade-up animate-reverse',
          )}
          disabled={isSuccess}
          loading={joinChatMutation.isPending}
          type="submit"
        >
          대화 시작하기
        </CustomButton>
      </form>
    </Modal>
  );
};

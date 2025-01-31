'use client';

import Image from 'next/image';

import { useTranslation } from '@/app/i18n/client';
import { trpc } from '@/app/trpc';
import { LOGIN_PROVIDERS } from '@/constants';
import { useUserData } from '@/hooks';
import { cn } from '@/utils';
import { toast } from '@/utils/client';
import { Badge, Skeleton, Spinner } from '@radix-ui/themes';

interface LoginConnectButtonProps {
  provider: LOGIN_PROVIDERS;
  isConnected: boolean;
}

export const LinkAccountButton = ({
  provider,
  isConnected,
}: LoginConnectButtonProps) => {
  const { t } = useTranslation('more');
  const { user, sessionUpdate } = useUserData();

  const unlinkAccountMutation = trpc.user.unlinkAccount.useMutation({
    onSuccess: async (provider) => {
      sessionUpdate({
        type: 'unlink-account',
        data: {
          provider,
        },
      });

      toast({
        message: t(`unlink-${provider}`),
      });
    },
  });

  const isLoading = !user || unlinkAccountMutation.isPending;

  return (
    <button className="flex-col gap-2 break-keep flex-center" type="button">
      <div
        className={cn(
          'size-14 flex-center rounded-full',
          {
            [LOGIN_PROVIDERS.GOOGLE]:
              'bg-white text-slate-850 border-slate-200 border',
            [LOGIN_PROVIDERS.KAKAO]: 'bg-kakao-yellow text-slate-850',
            [LOGIN_PROVIDERS.NAVER]: 'bg-naver-green',
          }[provider],
        )}
      >
        {unlinkAccountMutation.isPending ? (
          <Spinner />
        ) : (
          <Image
            alt={`${provider}-login`}
            height={28}
            src={`/assets/login/${provider}.png`}
            width={28}
          />
        )}
      </div>
      <Skeleton loading={isLoading}>
        <Badge color={isConnected ? 'gray' : 'blue'}>
          {isConnected ? t('connected-account') : t('need-connect-account')}
        </Badge>
      </Skeleton>
    </button>
  );
};

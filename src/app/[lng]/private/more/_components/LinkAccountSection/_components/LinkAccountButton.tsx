'use client';

import { Badge } from '@radix-ui/themes';
import { pick } from 'es-toolkit';
import Image from 'next/image';

import { Skeleton, Spinner } from '@/components';
import { useTranslation } from '@/configs/i18n/client';
import { trpc } from '@/configs/trpc';
import { LOGIN_PROVIDERS } from '@/constants';
import { useUserData } from '@/hooks';
import { cn } from '@/utils';
import { toast } from '@/utils/client';

interface LoginConnectButtonProps {
  provider: LOGIN_PROVIDERS;
  onLink?: () => void;
}

export const LinkAccountButton = ({
  provider,
  onLink,
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

  const idKey = `${provider}Id` as const;

  const isConnected = !!user?.[idKey];

  const isLastOne = !!(
    user &&
    Object.values(pick(user, ['googleId', 'kakaoId', 'naverId'])).filter(
      Boolean,
    ).length === 1 &&
    user[idKey]
  );

  return (
    <button
      className="flex-center cursor-pointer flex-col gap-2 break-keep"
      type="button"
      onClick={() => {
        if (isLastOne)
          return toast({
            message: t('last-account'),
          });

        if (isConnected) return unlinkAccountMutation.mutate({ provider });

        onLink?.();
      }}
    >
      <div
        className={cn(
          'flex-center size-14 rounded-full',
          {
            [LOGIN_PROVIDERS.GOOGLE]:
              'text-slate-850 border border-slate-200 bg-white',
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

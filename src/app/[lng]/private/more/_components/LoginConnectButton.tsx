'use client';

import Image from 'next/image';

import { useTranslation } from '@/app/i18n/client';
import { trpc } from '@/app/trpc/client';
import type { SessionDataToUpdate } from '@/auth';
import { LOGIN_PROVIDERS } from '@/constants';
import { useUserData } from '@/hooks';
import { customCookies, cn } from '@/utils';
import { toast } from '@/utils/client';
import { Badge, Skeleton, Spinner } from '@radix-ui/themes';

interface LoginConnectButtonProps {
  provider: LOGIN_PROVIDERS;
}

export const LoginConnectButton = ({ provider }: LoginConnectButtonProps) => {
  const { user, sessionUpdate } = useUserData();
  const { t } = useTranslation('more');
  const idKey = `${provider}Id` as const;

  const isConnected = !!user?.[idKey];

  const unlinkAccountMutation = trpc.user.unlinkAccount.useMutation({
    onSuccess: async ({ unlinkedProvider }) => {
      await sessionUpdate({
        unlinkedProvider,
      } satisfies SessionDataToUpdate);

      toast({
        message: t(`unlink-${unlinkedProvider}`),
      });
    },
  });

  const isLoading = !user || unlinkAccountMutation.isPending;

  return (
    <button
      className="flex-col gap-2 flex-center"
      disabled={isLoading}
      name="provider-state"
      type={isConnected ? 'button' : 'submit'}
      value={provider}
      onClick={async () => {
        if (isConnected) return unlinkAccountMutation.mutate({ provider });

        customCookies.set('PROVIDER_TO_CONNECT', provider);
      }}
    >
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

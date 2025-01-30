'use client';

import { pick } from 'es-toolkit';
import Image from 'next/image';

import { useEffect, useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { trpc } from '@/app/trpc/client';
import { LOGIN_PROVIDERS, SESSION_STORAGE } from '@/constants';
import { useUserData } from '@/hooks';
import { cn } from '@/utils';
import { toast } from '@/utils/client';
import { Badge, Skeleton, Spinner } from '@radix-ui/themes';

interface LoginConnectButtonProps {
  provider: LOGIN_PROVIDERS;
  name: string;
}

export const LinkAccountButton = ({
  provider,
  name,
}: LoginConnectButtonProps) => {
  const { user, sessionUpdate } = useUserData();
  const { t } = useTranslation('more');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const idKey = `${provider}Id` as const;

  const isConnected = !!user?.[idKey];

  const isLastOne = !!(
    user &&
    Object.values(pick(user, ['googleId', 'kakaoId', 'naverId'])).filter(
      Boolean,
    ).length === 1 &&
    user[idKey]
  );

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

  useEffect(() => {
    const linkedProvider = sessionStorage.getItem(
      SESSION_STORAGE.LINKED_PROVIDER,
    );

    if (linkedProvider !== provider) return;

    if (isConnected) {
      sessionStorage.removeItem(SESSION_STORAGE.LINKED_PROVIDER);

      toast({
        message: t(`link-${provider}`),
      });
    }
  }, [provider, t, isConnected]);

  return (
    <button
      className="flex-col gap-2 break-keep flex-center"
      disabled={isLoading}
      name={name}
      type={isConnected ? 'button' : 'submit'}
      value={provider}
      onClick={(e) => {
        if (isLastOne) {
          e.preventDefault();

          return toast({
            message: t('last-account'),
          });
        }
        if (isConnected) {
          e.preventDefault();
          unlinkAccountMutation.mutate({ provider });
        } else {
          setIsSubmitting(true);
          sessionStorage.setItem(SESSION_STORAGE.LINKED_PROVIDER, provider);
        }
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
        {unlinkAccountMutation.isPending || isSubmitting ? (
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

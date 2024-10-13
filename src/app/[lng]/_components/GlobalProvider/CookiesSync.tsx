'use client';

import { getCookie, deleteCookie, setCookie } from 'cookies-next';
import { useSession } from 'next-auth/react';

import { useEffect, useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { COOKIES } from '@/constants/cookies-key';
import { LOGIN_PROVIDERS } from '@/constants/etc';
import { isEnumValue } from '@/utils/isEnumValue';
import { toast } from '@/utils/toast';

export const CookiesSync = () => {
  const session = useSession();

  const user = session.data?.user;

  const userId = user?.id;

  const providerToConnect = getCookie(COOKIES.PROVIDER_TO_CONNECT);

  if (userId) setCookie(COOKIES.USER_ID, userId);

  const [deletedProviderToConnect, setDeletedProviderToConnect] =
    useState<LOGIN_PROVIDERS | null>(null);

  const hasProviderToConnect = isEnumValue(LOGIN_PROVIDERS, providerToConnect);

  useEffect(() => {
    if (!hasProviderToConnect || !providerToConnect) return;

    deleteCookie(COOKIES.PROVIDER_TO_CONNECT);
    setDeletedProviderToConnect(providerToConnect);
  }, [hasProviderToConnect, providerToConnect]);

  const { t } = useTranslation('more');

  useEffect(() => {
    if (!deletedProviderToConnect || !user) return;

    const isConnected =
      user[
        {
          [LOGIN_PROVIDERS.GOOGLE]: 'isGoogleConnected' as const,
          [LOGIN_PROVIDERS.KAKAO]: 'isKakaoConnected' as const,
          [LOGIN_PROVIDERS.NAVER]: 'isNaverConnected' as const,
        }[deletedProviderToConnect]
      ];

    if (isConnected) {
      toast({
        message: t(`${deletedProviderToConnect}-connected`),
      });
      setDeletedProviderToConnect(null);
    }
  }, [deletedProviderToConnect, t, user]);

  return null;
};

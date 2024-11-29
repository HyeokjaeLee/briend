import { useSession } from 'next-auth/react';

import { useEffect, useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { LOGIN_PROVIDERS } from '@/constants/etc';
import { cookies } from '@/stores/cookies';
import { isEnumValue } from '@/utils/isEnumValue';
import { toast } from '@/utils/toast';

export const useProviderConnectToast = () => {
  const session = useSession();

  const user = session.data?.user;

  const providerToConnect = cookies.get('PROVIDER_TO_CONNECT');

  const [deletedProviderToConnect, setDeletedProviderToConnect] =
    useState<LOGIN_PROVIDERS | null>(null);

  const hasProviderToConnect = isEnumValue(LOGIN_PROVIDERS, providerToConnect);

  useEffect(() => {
    if (!hasProviderToConnect || !providerToConnect) return;

    cookies.remove('PROVIDER_TO_CONNECT');
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
};

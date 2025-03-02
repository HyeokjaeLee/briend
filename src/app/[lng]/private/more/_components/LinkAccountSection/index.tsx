'use client';

import { useEffect, useState } from 'react';

import { ConfirmModal, Button } from '@/components';
import { useTranslation } from '@/configs/i18n/client';
import { LOGIN_PROVIDERS, SESSION_STORAGE } from '@/constants';
import { useUserData } from '@/hooks';
import { assert, assertEnum } from '@/utils';
import { toast } from '@/utils/client';

import { LinkAccountButton } from './_components/LinkAccountButton';
import { linkAccountAction } from './_server/linkAccountAction';

export const LinkAccountSection = () => {
  const { t } = useTranslation('more');
  const [openedProvider, setOpenedProvider] = useState<LOGIN_PROVIDERS>();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserData();

  useEffect(() => {
    const linkedProvider = sessionStorage.getItem(
      SESSION_STORAGE.LINKED_PROVIDER,
    );

    if (!linkedProvider) return;

    sessionStorage.removeItem(SESSION_STORAGE.LINKED_PROVIDER);

    //! 간혹 연동 후 user session을 못불러오는 경우가 있음
    if (!user) return location.reload();

    assertEnum(LOGIN_PROVIDERS, linkedProvider);

    const idKey = `${linkedProvider}Id` as const;

    if (user[idKey]) {
      toast({
        message: t(`link-${linkedProvider}`),
      });
    }
  }, [t, user]);

  return (
    <section className="flex-center gap-4">
      {Object.values(LOGIN_PROVIDERS).map((provider) => (
        <LinkAccountButton
          key={provider}
          provider={provider}
          onLink={() => {
            setOpenedProvider(provider);
          }}
        />
      ))}
      <ConfirmModal
        footer={
          <Button
            className="w-full"
            loading={isLoading}
            onClick={() => {
              setIsLoading(true);

              assert(openedProvider);

              sessionStorage.setItem(
                SESSION_STORAGE.LINKED_PROVIDER,
                openedProvider,
              );

              linkAccountAction(openedProvider);
            }}
          >
            {t('link-confirm-button')}
          </Button>
        }
        message={t('link-confirm-message')}
        opened={!!openedProvider}
        title={t('link-confirm-title')}
        onClose={() => setOpenedProvider(undefined)}
      />
    </section>
  );
};

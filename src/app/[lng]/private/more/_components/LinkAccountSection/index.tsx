'use client';

import { useEffect, useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { ConfirmModal, CustomButton } from '@/components';
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

    assert(user);

    assertEnum(LOGIN_PROVIDERS, linkedProvider);

    const idKey = `${linkedProvider}Id` as const;

    if (user[idKey]) {
      toast({
        message: t(`link-${linkedProvider}`),
      });
    }
  }, [t, user]);

  return (
    <section className="gap-4 flex-center">
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
          <CustomButton
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
          </CustomButton>
        }
        message={t('link-confirm-message')}
        opened={!!openedProvider}
        title={t('link-confirm-title')}
        onClose={() => setOpenedProvider(undefined)}
      />
    </section>
  );
};

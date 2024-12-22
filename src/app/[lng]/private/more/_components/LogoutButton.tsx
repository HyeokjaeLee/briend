'use client';

import { getSession } from 'next-auth/react';

import { useEffect } from 'react';
import { RiLogoutBoxRLine } from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/client';
import { CustomButton } from '@/components';
import { SESSION_STORAGE, type LANGUAGE } from '@/constants';
import { ROUTES } from '@/routes/client';
import { useGlobalStore } from '@/stores';

interface LogoutButtonProps {
  lng: LANGUAGE;
}

export const LogoutButton = ({ lng }: LogoutButtonProps) => {
  const { t } = useTranslation('more');
  const setGlobalLoading = useGlobalStore((state) => state.setGlobalLoading);

  useEffect(
    //! next auth 자체 리다이렉트 시 새로고침 전까지 세션이 삭제된것을 감지하지 못함
    () => () => {
      getSession().then((session) => {
        if (session) return;
        window.location.replace(`/${lng}${ROUTES.FRIEND_LIST.pathname}`);
      });
    },
    [lng],
  );

  return (
    <CustomButton
      className="flex w-full items-center justify-between text-slate-900"
      type="submit"
      variant="ghost"
      onClick={() => {
        setGlobalLoading(true, {
          delay: 0,
        });
        sessionStorage.setItem(SESSION_STORAGE.REPLACE_MARK, 'true');
        sessionStorage.setItem(
          SESSION_STORAGE.REFRESH_TOAST,
          t('logout-toast-message'),
        );
      }}
    >
      {t('logout')}
      <RiLogoutBoxRLine className="size-6" />
    </CustomButton>
  );
};

'use client';

import { nanoid } from 'nanoid';

import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { RiLogoutBoxRLine } from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/client';
import { CustomButton } from '@/components/CustomButton';
import { COOKIES } from '@/constants/cookies-key';
import { toast } from '@/utils/toast';

export const LogoutButton = () => {
  const { t } = useTranslation('more');
  const [, setCookie] = useCookies([COOKIES.USER_ID]);

  const [isLogouting, setIsLogouting] = useState(false);

  useEffect(() => {
    if (!isLogouting) return;

    return () => {
      setIsLogouting(false);
      setCookie(COOKIES.USER_ID, nanoid());
      toast({
        message: t('logout-toast-message'),
      });
    };
  }, [isLogouting, setCookie, t]);

  return (
    <CustomButton
      className="flex w-full items-center justify-between rounded-none text-slate-50"
      type="submit"
      variant="ghost"
      onClick={() => {
        setIsLogouting(true);
      }}
    >
      {t('logout')}
      <RiLogoutBoxRLine className="size-5" />
    </CustomButton>
  );
};

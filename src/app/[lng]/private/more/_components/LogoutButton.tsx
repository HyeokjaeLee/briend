'use client';

import { RiLogoutBoxRLine } from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/client';
import { CustomButton } from '@/components/CustomButton';
import { SESSION_STORAGE } from '@/constants/storage-key';
import { toast } from '@/utils/toast';

export const LogoutButton = () => {
  const { t } = useTranslation('more');

  return (
    <CustomButton
      className="flex w-full items-center justify-between rounded-none text-slate-50"
      type="submit"
      variant="ghost"
      onClick={() => {
        sessionStorage.setItem(SESSION_STORAGE.REPLACE_MARK, 'true');
        toast({
          message: t('logout-toast-message'),
        });
      }}
    >
      {t('logout')}
      <RiLogoutBoxRLine className="size-5" />
    </CustomButton>
  );
};

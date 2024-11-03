'use client';

import { RiLogoutBoxRLine } from 'react-icons/ri';

import { useTranslation } from '@/app/i18n/client';
import { CustomButton } from '@/components/CustomButton';
import { SESSION_STORAGE } from '@/constants/storage-key';
import { useGlobalStore } from '@/stores/global';
import { toast } from '@/utils/toast';

export const LogoutButton = () => {
  const { t } = useTranslation('more');
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);

  return (
    <CustomButton
      className="flex w-full items-center justify-between text-slate-900"
      type="submit"
      variant="ghost"
      onClick={() => {
        setIsLoading(true);
        sessionStorage.setItem(SESSION_STORAGE.REPLACE_MARK, 'true');
        toast({
          message: t('logout-toast-message'),
        });
      }}
    >
      {t('logout')}
      <RiLogoutBoxRLine className="size-6" />
    </CustomButton>
  );
};

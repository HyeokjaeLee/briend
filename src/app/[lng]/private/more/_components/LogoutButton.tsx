'use client';

import { RiLogoutBoxRLine } from 'react-icons/ri';

import { trpc } from '@/configs/trpc';
import { CustomButton } from '@/components';
import { SESSION_STORAGE } from '@/constants';
import { useLanguage, useSidePanel } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useGlobalStore } from '@/stores';

interface LogoutButtonProps {
  logoutToastMessage: string;
  children?: React.ReactNode;
}

export const LogoutButton = ({
  logoutToastMessage,
  children,
}: LogoutButtonProps) => {
  const { lng } = useLanguage();
  const setGlobalLoading = useGlobalStore((state) => state.setGlobalLoading);
  const { push } = useSidePanel();

  const logoutMutation = trpc.user.logout.useMutation({
    onMutate: () => setGlobalLoading(true),
    onSuccess: () => {
      sessionStorage.setItem(SESSION_STORAGE.REPLACE_MARK, 'true');
      sessionStorage.setItem(SESSION_STORAGE.REFRESH_TOAST, logoutToastMessage);
      push(ROUTES.FRIEND_LIST.pathname);
      location.replace(`/${lng}${ROUTES.FRIEND_LIST.pathname}`);
    },
  });

  return (
    <CustomButton
      className="flex w-full items-center justify-between text-slate-900"
      loading={logoutMutation.isPending}
      variant="ghost"
      onClick={() => logoutMutation.mutate()}
    >
      {children}
      <RiLogoutBoxRLine className="size-6" />
    </CustomButton>
  );
};

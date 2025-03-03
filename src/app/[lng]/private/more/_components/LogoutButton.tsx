'use client';

import { RiLogoutBoxRLine } from 'react-icons/ri';

import { Button } from '@/components';
import { trpc } from '@/configs/trpc';
import { COOKIES, SESSION_STORAGE } from '@/constants';
import { useLanguage, useSidePanel } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useGlobalStore } from '@/stores';
import { customCookies } from '@/utils';

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
      customCookies.set(COOKIES.CHANGED_SESSION, 'logout');

      push(ROUTES.FRIEND_LIST.pathname);

      location.replace(`/${lng}${ROUTES.FRIEND_LIST.pathname}`);
    },
  });

  return (
    <Button
      className="flex w-full items-center justify-between text-slate-900"
      loading={logoutMutation.isPending}
      variant="ghost"
      onClick={() => logoutMutation.mutate()}
    >
      {children}
      <RiLogoutBoxRLine className="size-6" />
    </Button>
  );
};

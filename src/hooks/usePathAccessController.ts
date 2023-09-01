import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface PathAccessControllerParams {
  isBinded: boolean;
  isLogin: boolean;
}

export const usePathAccessController = ({
  isBinded,
  isLogin,
}: PathAccessControllerParams) => {
  const router = useRouter();
  const pathname = usePathname();
  const isPrivatePath = pathname?.split('/')[1] === 'private';

  useEffect(() => {
    if (isBinded && !isLogin && isPrivatePath) router.replace('/');
  }, [isBinded, isLogin, isPrivatePath, router]);
};

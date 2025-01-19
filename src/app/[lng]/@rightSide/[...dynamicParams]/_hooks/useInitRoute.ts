import { usePathname } from 'next/navigation';

import { useEffect } from 'react';

import { useCustomRouter, useSidePanel } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useGlobalStore } from '@/stores';
import { findRoute } from '@/utils/findRoute';

interface UseInitRouteProps {
  routeName: string;
}

export const useInitRoute = ({ routeName }: UseInitRouteProps) => {
  const hasSidePanel = useGlobalStore((state) => state.hasSidePanel);
  const sidePanel = useSidePanel();

  const pathaname = usePathname();

  const { name: currentRouteName } = findRoute(pathaname);

  const isSameRoute = routeName === currentRouteName;
  const isDefaultRoute = routeName === 'FRIEND_LIST';

  const router = useCustomRouter();

  useEffect(() => {
    if (!hasSidePanel) return sidePanel.push(ROUTES.FRIEND_LIST.pathname);

    if (!isSameRoute || isDefaultRoute) return;

    router.replace(ROUTES.FRIEND_LIST.pathname);
  }, [hasSidePanel, isDefaultRoute, isSameRoute, router, sidePanel]);
};

import { usePathname } from 'next/navigation';

import { useEffect, useLayoutEffect } from 'react';

import { SESSION_STORAGE } from '@/constants';
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

  useLayoutEffect(() => {
    const sidePanelUrlSession = sessionStorage.getItem(
      SESSION_STORAGE.SIDE_PANEL_URL,
    );

    if (!sidePanelUrlSession) return;

    sidePanel.push(sidePanelUrlSession);
  }, [sidePanel]);

  useEffect(() => {
    if (!isSameRoute || isDefaultRoute) return;

    if (!hasSidePanel) return sidePanel.push(ROUTES.FRIEND_LIST.pathname);

    router.replace(ROUTES.FRIEND_LIST.pathname);
  }, [hasSidePanel, isDefaultRoute, isSameRoute, router, sidePanel]);
};

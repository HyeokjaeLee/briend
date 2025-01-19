import { usePathname } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { useCustomRouter } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useGlobalStore } from '@/stores';
import { findRoute } from '@/utils/findRoute';

interface UseInitRouteProps {
  routeName: string;
}

export const useInitRoute = ({ routeName }: UseInitRouteProps) => {
  const [setSidePanelUrl, hasSidePanel] = useGlobalStore(
    useShallow((state) => [state.setSidePanelUrl, state.hasSidePanel]),
  );
  const pathaname = usePathname();

  const { name: currentRouteName } = findRoute(pathaname);

  const isSameRoute = routeName === currentRouteName;
  const isDefaultRoute = routeName === 'FRIEND_LIST';

  const router = useCustomRouter();

  useEffect(() => {
    if (!hasSidePanel) return setSidePanelUrl(ROUTES.FRIEND_LIST.pathname);

    if (!isSameRoute || isDefaultRoute) return;

    router.replace(ROUTES.FRIEND_LIST.pathname);
  }, [isSameRoute, router, hasSidePanel, isDefaultRoute, setSidePanelUrl]);
};

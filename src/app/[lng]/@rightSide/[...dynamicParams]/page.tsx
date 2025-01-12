'use client';

import { usePathname } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

import { memo, useEffect } from 'react';

import { useCustomRouter } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { MEDIA_QUERY_BREAK_POINT, useGlobalStore } from '@/stores';
import { findRoute } from '@/utils';
import { createOnlyClientComponent } from '@/utils/client';

import { ChattingTemplate } from './_components/ChattingTemplate';
import EmptyTemplate from './_components/Empty';

const RightSidePanelPage = createOnlyClientComponent(() => {
  const [hasSidePanel, sidePanelUrl, setSidePanelUrl] = useGlobalStore(
    useShallow((state) => [
      MEDIA_QUERY_BREAK_POINT.sm <= state.mediaQueryBreakPoint,
      state.sidePanelUrl,
      state.setSidePanelUrl,
    ]),
  );

  const pathaname = usePathname();

  const { name: routeName } = findRoute(sidePanelUrl);

  const { name: currentRouteName } = findRoute(pathaname);

  const isSameRoute = routeName === currentRouteName;
  const isDefaultRoute = routeName === 'FRIEND_LIST';

  const router = useCustomRouter();

  useEffect(() => {
    if (!hasSidePanel) return setSidePanelUrl(ROUTES.FRIEND_LIST.pathname);

    if (!isSameRoute || isDefaultRoute) return;

    router.replace(ROUTES.FRIEND_LIST.pathname);
  }, [isSameRoute, router, hasSidePanel, isDefaultRoute, setSidePanelUrl]);

  switch (routeName) {
    case 'CHATTING_ROOM': {
      const userId = sidePanelUrl.split('/')[3];

      return <ChattingTemplate userId={userId} />;
    }

    default:
      return <EmptyTemplate />;
  }
}, EmptyTemplate);

export default memo(RightSidePanelPage);

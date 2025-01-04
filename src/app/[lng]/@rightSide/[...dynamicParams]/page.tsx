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
  const [hasSidePanel, sidePanelUrl] = useGlobalStore(
    useShallow((state) => [
      MEDIA_QUERY_BREAK_POINT.sm <= state.mediaQueryBreakPoint,
      state.sidePanelUrl,
    ]),
  );

  const pathaname = usePathname();

  const { name: routeName } = findRoute(sidePanelUrl);
  const { name: currentRouteName } = findRoute(pathaname);

  const isSameRoute = routeName === currentRouteName;

  const router = useCustomRouter();

  useEffect(() => {
    if (!isSameRoute || !hasSidePanel) return;

    router.replace(ROUTES.FRIEND_LIST.pathname);
  }, [isSameRoute, router, hasSidePanel]);

  if (!hasSidePanel) return null;

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

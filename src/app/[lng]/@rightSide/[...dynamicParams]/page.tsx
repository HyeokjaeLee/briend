'use client';

import { useShallow } from 'zustand/shallow';

import { MEDIA_QUERY_BREAK_POINT, useGlobalStore } from '@/stores';
import { findRoute } from '@/utils';
import { createOnlyClientComponent } from '@/utils/client';

import EmptyTemplate from './_templates/Empty';

const RightSidePanelPage = createOnlyClientComponent(() => {
  const [hasSidePanel, sidePanelUrl] = useGlobalStore(
    useShallow((state) => [
      MEDIA_QUERY_BREAK_POINT.sm <= state.mediaQueryBreakPoint,
      state.sidePanelUrl,
    ]),
  );

  if (!hasSidePanel) return null;

  const { name: routeName } = findRoute(sidePanelUrl);

  switch (routeName) {
    case 'CHATTING_ROOM':
      return null;

    default:
      return <EmptyTemplate />;
  }
}, EmptyTemplate);

export default RightSidePanelPage;

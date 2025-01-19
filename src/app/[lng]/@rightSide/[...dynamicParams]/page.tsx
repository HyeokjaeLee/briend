'use client';

import { useShallow } from 'zustand/shallow';

import { useGlobalStore } from '@/stores';
import { findRoute } from '@/utils';

import { SideContents } from './_components/SideContents';
import { useInitRoute } from './_hooks/useInitRoute';

export default function RightSidePanelPage() {
  const [sidePanelUrl, animationType, navigationAnimation] = useGlobalStore(
    useShallow((state) => [
      state.sidePanelUrl,
      state.animationType,
      state.navigationAnimation,
    ]),
  );

  const { name: routeName } = findRoute(sidePanelUrl);

  useInitRoute({ routeName });

  return (
    <aside className="hidden flex-1 bg-white sm:block">
      <SideContents routeName={routeName} sidePanelUrl={sidePanelUrl} />
    </aside>
  );
}

import { useMemo } from 'react';

import { type NAVIGATION_ANIMATION, useSidePanelStore } from '@/stores';
import {
  NAVIGATION_ANIMATION_DURATION,
  setExitNavigationAnimation,
} from '@/utils/client';

interface SidePanelOptions {
  withAnimation?: NAVIGATION_ANIMATION;
}

interface SidePanel {
  push: (href: string, options?: SidePanelOptions) => void;
}

let memoizedSidePanel: SidePanel | undefined;

let timer: NodeJS.Timeout | undefined;

export const useSidePanel = memoizedSidePanel
  ? () => memoizedSidePanel!
  : () => {
      const setSidePanelUrl = useSidePanelStore(
        (state) => state.setSidePanelUrl,
      );

      memoizedSidePanel = useMemo(
        () => ({
          push: (href, options) => {
            const { sidePanelUrl } = useSidePanelStore.getState();

            if (timer) clearTimeout(timer);

            const isSameHref = sidePanelUrl === href;

            if (isSameHref) return console.info('blocked by same href');

            const { withAnimation = 'NONE' } = options ?? {};

            setExitNavigationAnimation(withAnimation, true);

            if (withAnimation === 'NONE') return setSidePanelUrl(href);

            timer = setTimeout(() => {
              setSidePanelUrl(href);
            }, NAVIGATION_ANIMATION_DURATION.EXIT);
          },
        }),
        [setSidePanelUrl],
      );

      return memoizedSidePanel;
    };

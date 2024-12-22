import { throttle } from 'es-toolkit';

import { useLayoutEffect } from 'react';

import { SELECTOR } from '@/constants/selector';
import { useUrl } from '@/hooks/useUrl';
import { useGlobalStore } from '@/stores/global';

export const GlobalEventListener = () => {
  const url = useUrl({
    origin: false,
  });

  const resetMediaQuery = useGlobalStore((state) => state.resetMediaQuery);

  useLayoutEffect(() => {
    const updateHeight = () => {
      const height = window.visualViewport?.height || window.innerHeight;
      const topHeaderHeight =
        document.getElementById(SELECTOR.TOP_HEADER)?.clientHeight ?? 0;
      const bottomNavHeight =
        document.getElementById(SELECTOR.BOTTOM_NAV)?.clientHeight ?? 0;

      const contentHeight = height - topHeaderHeight - bottomNavHeight;

      document.documentElement.style.setProperty(
        '--viewport-height',
        `${height}px`,
      );
      document.documentElement.style.setProperty(
        '--content-height',
        `${contentHeight}px`,
      );
    };

    const resizeHandler = () => {
      updateHeight();
      resetMediaQuery();
    };

    const debouncedResizeHandler = throttle(resizeHandler, 33);

    resizeHandler();

    window.addEventListener('resize', debouncedResizeHandler);
    window.visualViewport?.addEventListener('resize', debouncedResizeHandler);

    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
      window.visualViewport?.removeEventListener(
        'resize',
        debouncedResizeHandler,
      );
    };
  }, [resetMediaQuery, url]);

  return null;
};

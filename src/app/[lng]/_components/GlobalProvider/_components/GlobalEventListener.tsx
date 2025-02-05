import { throttle } from 'es-toolkit';

import { useLayoutEffect } from 'react';

import { SELECTOR } from '@/constants';
import { useGlobalStore } from '@/stores';

export const GlobalEventListener = () => {
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

    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
          debouncedResizeHandler();
        }
      });
    });

    observer.observe(window.document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener('resize', debouncedResizeHandler);
    window.visualViewport?.addEventListener('resize', debouncedResizeHandler);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', debouncedResizeHandler);
      window.visualViewport?.removeEventListener(
        'resize',
        debouncedResizeHandler,
      );
    };
  }, [resetMediaQuery]);

  return null;
};

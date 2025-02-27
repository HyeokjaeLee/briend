import { throttle } from 'es-toolkit';
import { useLayoutEffect } from 'react';

import { useGlobalStore } from '@/stores';

export const useViewportListener = () => {
  const resetMediaQuery = useGlobalStore((state) => state.resetMediaQuery);

  useLayoutEffect(() => {
    const resizeHandler = () => {
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
};

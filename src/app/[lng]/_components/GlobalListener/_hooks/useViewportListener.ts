import { throttle } from 'es-toolkit';
import { useLayoutEffect } from 'react';
import { useShallow } from 'zustand/shallow';

import { useGlobalStore } from '@/stores';

export const useViewportListener = () => {
  const [resetMediaQuery, resetIsTouchDevice] = useGlobalStore(
    useShallow((state) => [state.resetMediaQuery, state.resetIsTouchDevice]),
  );

  useLayoutEffect(() => {
    const resizeHandler = () => {
      resetMediaQuery();

      const isTouchDevice = resetIsTouchDevice();

      if (!isTouchDevice) return;

      const height = window.visualViewport?.height || window.innerHeight;

      document.documentElement.style.setProperty(
        '--viewport-height',
        `${height}px`,
      );
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
  }, [resetMediaQuery, resetIsTouchDevice]);
};

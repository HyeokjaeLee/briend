import { throttle } from 'es-toolkit';
import { useLayoutEffect } from 'react';
import { useShallow } from 'zustand/shallow';

import { useGlobalStore } from '@/stores';

const CDVH_PROPERTY = '--viewport-height';

export const useViewportListener = () => {
  const [resetMediaQuery, resetIsTouchDevice] = useGlobalStore(
    useShallow((state) => [state.resetMediaQuery, state.resetIsTouchDevice]),
  );

  useLayoutEffect(() => {
    const resizeHandler = () => {
      resetMediaQuery();

      const isTouchDevice = resetIsTouchDevice();

      const { style } = document.documentElement;

      const prevHeight = style.getPropertyValue(CDVH_PROPERTY);

      const height = isTouchDevice
        ? `${window.visualViewport?.height || window.innerHeight}px`
        : '100dvh';

      if (prevHeight === height) return;

      document.documentElement.style.setProperty(CDVH_PROPERTY, height);
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

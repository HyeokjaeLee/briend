import { throttle } from 'es-toolkit';

import { Suspense, useLayoutEffect } from 'react';

import { SELECTOR } from '@/constants/selector';
import { useUrl } from '@/hooks/useUrl';

const GlobalEventListenerController = () => {
  const url = useUrl({
    origin: false,
  });

  useLayoutEffect(() => {
    const updateHeight = throttle(() => {
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
    }, 33);

    updateHeight();

    window.addEventListener('resize', updateHeight);
    window.visualViewport?.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.visualViewport?.removeEventListener('resize', updateHeight);
    };
  }, [url]);

  return null;
};

export const GlobalEventListener = () => {
  return (
    <Suspense>
      <GlobalEventListenerController />
    </Suspense>
  );
};

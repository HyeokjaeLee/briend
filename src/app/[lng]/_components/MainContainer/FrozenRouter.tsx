'use client';

import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname } from 'next/navigation';

import { useContext, useEffect, useRef, type PropsWithChildren } from 'react';

export const FrozenRouter = ({ children }: PropsWithChildren) => {
  const context = useContext(LayoutRouterContext);
  const prevContextRef = useRef<typeof context>(null);

  const url = usePathname();
  const prevUrlRef = useRef<string>(undefined);

  useEffect(() => {
    prevUrlRef.current = url;
    prevContextRef.current = context;

    return () => {
      prevUrlRef.current = undefined;
      prevContextRef.current = null;
    };
  }, [context, url]);

  const changed =
    url !== prevUrlRef.current && prevUrlRef.current !== undefined;

  return (
    <LayoutRouterContext.Provider
      value={changed ? prevContextRef.current : context}
    >
      {children}
    </LayoutRouterContext.Provider>
  );
};

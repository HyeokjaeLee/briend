'use client';

import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname } from 'next/navigation';

import { useContext, useEffect, useRef, type PropsWithChildren } from 'react';

export const FrozenRouter = ({ children }: PropsWithChildren) => {
  const context = useContext(LayoutRouterContext);
  const prevContextRef = useRef<typeof context>(null);

  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    prevPathnameRef.current = pathname;
    prevContextRef.current = context;

    return () => {
      prevPathnameRef.current = null;
      prevContextRef.current = null;
    };
  }, [context, pathname]);

  const changed =
    prevPathnameRef.current && prevPathnameRef.current !== pathname;

  return (
    <LayoutRouterContext.Provider
      value={changed ? prevContextRef.current : context}
    >
      {children}
    </LayoutRouterContext.Provider>
  );
};

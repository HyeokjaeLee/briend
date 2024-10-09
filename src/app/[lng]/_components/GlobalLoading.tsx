'use client';

import type { PropsWithChildren } from 'react';

import { useGlobalStore } from '@/stores/global';
import Logo from '@/svgs/logo.svg';
import { Spinner } from '@radix-ui/themes';

export const GlobalLoading = ({ children }: PropsWithChildren) => {
  const isLoading = useGlobalStore((state) => state.isLoading);

  return (
    <>
      {children}
      {isLoading ? (
        <article className="absolute size-full flex-1 animate-fade flex-col gap-4 bg-slate-850/80 backdrop-blur-xl flex-center animate-duration-150">
          <Logo className="w-24" />
          <Spinner className="text-zinc-50" size="3" />
        </article>
      ) : null}
    </>
  );
};

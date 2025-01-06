import type { PropsWithChildren } from 'react';
import { Suspense } from 'react';

import Logo from '@/svgs/logo.svg';
import { cn } from '@/utils';
import { Skeleton } from '@radix-ui/themes';

export const GlobalSuspense = ({ children }: PropsWithChildren) => {
  return (
    <Suspense
      fallback={
        <>
          <div className="hidden flex-1 bg-slate-100 xl:block" />
          <div className="flex size-full w-fit max-w-screen-xl flex-[2]">
            <div
              className={cn(
                'flex size-full max-h-cdvh min-h-cdvh w-full flex-col overflow-hidden',
                'flex-1 shadow-none sm:border-r sm:border-slate-100 xl:shadow-lg-left',
              )}
            >
              <div className="flex size-full flex-col gap-12 p-8">
                {new Array(100).fill(0).map((_, i) => (
                  <div
                    key={i}
                    className={cn('flex gap-4 animate-fade-down', {
                      'animate-delay-75': i % 4 === 0,
                      'animate-duration-75': i % 3 === 1,
                    })}
                  >
                    <Skeleton className="size-20 rounded-xl" />
                    <div className="my-auto flex flex-col gap-2">
                      <Skeleton
                        className={cn('h-6 w-60', {
                          'w-80': i % 2 === 0,
                        })}
                      />
                      <Skeleton
                        className={cn('h-6 w-72', {
                          'w-96': i % 2 === 0,
                        })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden size-full flex-1 items-center justify-center bg-white sm:flex">
              <Logo className="w-40" />
            </div>
          </div>
        </>
      }
    >
      {children}
    </Suspense>
  );
};

'use client';

import { usePathname } from 'next/navigation';

import { ToastContainer, Slide } from 'react-toastify';

import { SELECTOR } from '@/constants/selector';
import { cn, findRoute } from '@/utils';

import { BackHeader } from './_components/BackHeader';
import { RootHeader } from './_components/RootHeader';

export const GlobalHeader = () => {
  const pathname = usePathname();

  const { topHeaderType } = findRoute(pathname);

  return topHeaderType !== 'none' ? (
    <header
      className="relative top-0 h-fit w-full max-w-xl"
      id={SELECTOR.TOP_HEADER}
    >
      {
        {
          root: <RootHeader />,
          back: <BackHeader />,
          empty: null,
        }[topHeaderType]
      }
      <ToastContainer
        draggable
        bodyClassName="p-0 whitespace-pre-line flex gap-1 text-black text-lg font-medium font-pretendard"
        className={cn(
          'h-0 relative p-0 w-[calc(100%-2rem)]',
          'left-1/2 xs:left-4',
        )}
        draggableDirection="y"
        draggablePercent={50}
        limit={3}
        position="top-center"
        theme="colored"
        toastClassName={cn(
          'flex justify-center px-4 py-0',
          '!bg-zinc-50/90',
          'rounded-lg backdrop-blur-sm cursor-grab',
        )}
        transition={Slide}
      />
    </header>
  ) : null;
};

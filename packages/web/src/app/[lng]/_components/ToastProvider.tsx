'use client';

import '@/styles/toastify.css';

import { RiCloseLine } from 'react-icons/ri';
import { Slide, ToastContainer } from 'react-toastify';
import { useShallow } from 'zustand/shallow';

import { Button } from '@/components';
import { MEDIA_QUERY_BREAK_POINT, useGlobalStore } from '@/stores';
import { cn } from '@/utils';

export const ToastProvider = () => {
  const [isOverSm, isTouchDevice] = useGlobalStore(
    useShallow((state) => [
      MEDIA_QUERY_BREAK_POINT.sm <= state.mediaQueryBreakPoint,
      state.isTouchDevice,
    ]),
  );

  return (
    <ToastContainer
      draggable={isTouchDevice}
      className={cn(
        'h-0 p-0 relative w-[calc(100%-2rem)]',
        'sm:min-w-80 sm:fixed sm:w-fit xl:w-[calc(100%-2rem)] xl:relative',
      )}
      draggableDirection="x"
      draggablePercent={50}
      limit={3}
      position={isOverSm ? 'top-right' : 'top-center'}
      closeButton={({ closeToast, ariaLabel }) => (
        <Button
          size="8"
          onlyIcon
          variant="ghost"
          aria-label={ariaLabel}
          className={cn('absolute right-1 top-1', {
            hidden: isTouchDevice,
          })}
          onClick={closeToast}
        >
          <RiCloseLine />
        </Button>
      )}
      theme="colored"
      toastClassName={cn(
        'flex justify-start w-full px-4',
        'rounded-lg backdrop-blur-sm cursor-grab font-pretendard whitespace-pre-line font-medium text-lg',
        'left-4 xs:left-0',
      )}
      transition={Slide}
    />
  );
};

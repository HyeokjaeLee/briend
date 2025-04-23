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
        'h-0! w-[calc(100%-2rem)]! p-0! relative!',
        'sm:w-fit! sm:fixed! sm:min-w-80',
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
        'flex! w-full! px-4! justify-start',
        'rounded-lg! backdrop-blur-sm! font-pretendard! whitespace-pre-line! font-medium! text-lg!',
        'left-4! xs:left-0! xl:right-0',
      )}
      transition={Slide}
    />
  );
};

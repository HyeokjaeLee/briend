'use client';

import { Slide, ToastContainer } from 'react-toastify';

import { cn } from '@/utils';

import { useRefreshToast } from './_hooks/useRefreshToast';

export const ToastProvider = () => {
  useRefreshToast();

  return (
    <ToastContainer
      draggable
      className={cn(
        'h-0 p-0 relative w-[calc(100%-2rem)]',
        'sm:min-w-80 sm:fixed sm:w-fit',
      )}
      draggableDirection="x"
      draggablePercent={50}
      limit={3}
      position="top-center"
      theme="colored"
      toastClassName={cn(
        'flex justify-start w-full px-4',
        'rounded-lg backdrop-blur-sm cursor-grab font-pretendard whitespace-pre-line font-medium text-lg',
      )}
      transition={Slide}
    />
  );
};

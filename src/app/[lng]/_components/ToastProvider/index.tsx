'use client';

import { ToastContainer, Slide } from 'react-toastify';

import { cn } from '@/utils/cn';

import { useProviderConnectToast } from './_hooks/useProviderConnectToast';
import { useRefreshToast } from './_hooks/useRefreshToast';

export const ToastProvider = () => {
  useRefreshToast();

  useProviderConnectToast();

  return (
    <ToastContainer
      draggable
      bodyClassName="p-0 whitespace-pre-line flex gap-1 text-black text-lg font-medium font-pretendard"
      className={cn(
        'h-0 relative p-0 w-[calc(100%-2rem)]',
        'left-4 xs:left-1/2',
      )}
      draggableDirection="x"
      draggablePercent={50}
      limit={3}
      position="top-center"
      theme="colored"
      toastClassName={cn(
        'flex justify-center px-4 py-0',
        '!bg-white/90',
        'rounded-lg backdrop-blur-sm cursor-grab',
      )}
      transition={Slide}
    />
  );
};

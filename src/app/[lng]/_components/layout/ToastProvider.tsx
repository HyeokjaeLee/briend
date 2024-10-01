'use client';

import { ToastContainer, Slide } from 'react-toastify';

import { cn } from '@/utils/cn';

export const ToastProvider = () => (
  <ToastContainer
    draggable
    bodyClassName="p-0 whitespace-pre-line flex gap-1 text-black text-lg font-medium font-pretendard"
    className={cn('h-0 relative p-0 w-[calc(100%-2rem)]', 'left-1/2 xs:left-4')}
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
);

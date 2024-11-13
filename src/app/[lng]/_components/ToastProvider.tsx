'use client';

import { useEffect } from 'react';
import { ToastContainer, Slide } from 'react-toastify';

import { SESSION_STORAGE } from '@/constants/storage-key';
import { cn } from '@/utils/cn';
import { toast } from '@/utils/toast';

export const ToastProvider = () => {
  useEffect(() => {
    const refreshToast = sessionStorage.getItem(SESSION_STORAGE.REFRESH_TOAST);

    if (refreshToast) {
      sessionStorage.removeItem(SESSION_STORAGE.REFRESH_TOAST);
      toast({
        message: refreshToast,
      });
    }
  }, []);

  return (
    <ToastContainer
      draggable
      bodyClassName="p-0 whitespace-pre-line flex gap-1 text-black text-lg font-medium font-pretendard"
      className={cn(
        'h-0 relative p-0 w-[calc(100%-2rem)]',
        'left-1/2 xs:left-4',
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

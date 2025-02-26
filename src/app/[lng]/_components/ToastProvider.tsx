'use client';

import '@/styles/toastify.css';

import { Slide, ToastContainer } from 'react-toastify';

import { cn } from '@/utils';

export const ToastProvider = () => {
  return (
    <ToastContainer
      draggable
      className={cn(
        'relative! h-0! w-[calc(100%-2rem)]! p-0!',
        'sm:fixed! sm:w-fit! sm:min-w-80! xl:relative! xl:w-[calc(100%-2rem)]!',
      )}
      draggableDirection="x"
      draggablePercent={50}
      limit={3}
      position="top-center"
      theme="colored"
      toastClassName={cn(
        'flex! justify-start w-full! px-4!',
        'rounded-lg! backdrop-blur-sm! cursor-grab! font-pretendard! whitespace-pre-line! font-medium! text-lg!',
        'left-4! xs:left-0!',
      )}
      transition={Slide}
    />
  );
};

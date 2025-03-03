'use client';

import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/utils';
export interface ValidationMessageProps {
  message?: string;
}

export const ValidationMessage = ({ message }: ValidationMessageProps) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          animate={{ opacity: 1, y: 0, height: 'auto', marginTop: '0.5rem' }}
          className={cn(
            'overflow-hidden px-2 text-sm font-normal text-red-500',
          )}
          exit={{ opacity: 0, y: -10, height: 0, marginTop: '0' }}
          initial={{ opacity: 0, y: -10, height: 0, marginTop: '0' }}
          transition={{ duration: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
};

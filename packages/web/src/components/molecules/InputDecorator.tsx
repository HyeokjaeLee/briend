'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';

import { cn } from '@/utils';

export interface InputDecoratorProps {
  message?: string;
  className?: string;
  children: React.ReactNode;
  type?: 'input' | 'checkbox';
  label?: string;
  required?: boolean;
}

export const InputDecorator = ({
  message,
  className,
  children,
  type = 'input',
  label,
  required,
}: InputDecoratorProps) => {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'w-full select-none flex-col items-center gap-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
        className,
      )}
    >
      <div
        className={cn('flex gap-2', {
          'flex-row-reverse items-center justify-end': type === 'checkbox',
          'flex-col': type === 'input',
        })}
      >
        <span
          className={cn('text-base font-medium leading-none text-slate-500', {
            'after:ml-1 after:text-red-500 after:content-["*"]': required,
          })}
        >
          {label}
        </span>
        {children}
      </div>
      <AnimatePresence>
        {message ? (
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
        ) : null}
      </AnimatePresence>
    </LabelPrimitive.Root>
  );
};

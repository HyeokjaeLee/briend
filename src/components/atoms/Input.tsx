'use client';

import type { RefAttributes } from 'react';

import { useGlobalStore } from '@/stores';
import { cn } from '@/utils';

export interface InputProps
  extends RefAttributes<HTMLInputElement>,
    React.InputHTMLAttributes<HTMLInputElement> {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export const Input = ({
  className,
  type,
  leftContent,
  rightContent,
  disabled,
  ...restProps
}: InputProps) => {
  const isTouchDevice = useGlobalStore((state) => state.isTouchDevice);

  return (
    <label
      aria-label="input-container"
      className={cn(
        // Base
        'relative',
        'inline-flex',
        'items-center',
        'justify-center',
        'overflow-hidden',
        'gap-2',
        'transition-[color,box-shadow,border] duration-150',
        'rounded-xl',
        'h-14 w-full px-4',
        'bg-transparent',
        'has-[input:disabled]:bg-slate-50',
        "[&_svg:not([class*='size-'])]:size-5",

        // Borders
        'border',
        'border-input',
        'has-[input:focus]:border-primary',
        'has-[input:disabled]:opacity-50',
        'has-[input:disabled]:cursor-not-allowed',
        'has-[input[aria-invalid=true]]:border-destructive',
        {
          'pl-3': leftContent,
          'pr-3': rightContent,
          'not-has-[input:disabled]:hover:border-primary/50': !isTouchDevice,
        },

        // Custom class
        className,
      )}
      tabIndex={-1}
      role="group"
      aria-disabled={disabled}
      data-disabled={disabled}
    >
      {leftContent}
      <input
        {...restProps}
        type={type}
        disabled={disabled}
        className={cn(
          // 최소한의 투명 스타일
          'size-full',
          'm-0 p-0',
          'bg-transparent',
          'border-none',
          'outline-none',
          'placeholder:text-muted-foreground',
          'selection:bg-primary/20',
          'disabled:cursor-not-allowed',

          // Typography
          'text-lg',
          'text-primary',
          'font-pretendard',
          'font-medium',

          // 파일 입력 스타일
          'file:bg-transparent',
          'file:border-0',
          'file:font-medium',
        )}
      />
      {rightContent}
    </label>
  );
};

Input.displayName = 'Input';

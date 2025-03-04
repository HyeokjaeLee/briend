'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { useGlobalStore } from '@/stores';
import { cn } from '@/utils';

export const badgeVariants = cva(
  [
    // 레이아웃/기본
    'inline-flex w-fit shrink-0 items-center justify-center',
    'overflow-hidden whitespace-nowrap rounded-sm',

    // 간격/패딩
    'gap-1 px-1.5 py-0.5',

    // 텍스트
    'text-xs font-semibold',

    // 테두리
    'border',

    // 포커스/상태
    'focus-visible:border-ring focus-visible:ring-ring/50',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
    'aria-invalid:border-destructive',

    // 애니메이션
    'transition-[color,box-shadow] focus-visible:ring-[3px]',

    // 아이콘
    '[&>svg]:pointer-events-none [&>svg]:size-3',
  ],
  {
    variants: {
      color: {
        blue: 'border-blue-200 bg-blue-100 text-blue-500',
        yellow: 'border-yellow-200 bg-yellow-100 text-yellow-500',
        gray: 'border-gray-200 bg-gray-100 text-gray-500',
      },
      isTouchDevice: {
        false: '',
        true: '',
      },
    },
    defaultVariants: {
      color: 'blue',
    },
    compoundVariants: [
      {
        isTouchDevice: false,
        color: 'blue',
        className: '[a&]:hover:bg-blue-200',
      },
      {
        isTouchDevice: false,
        color: 'yellow',
        className: '[a&]:hover:bg-yellow-200',
      },
      {
        isTouchDevice: false,
        color: 'gray',
        className: '[a&]:hover:bg-gray-200',
      },
    ],
  },
);

export interface BadgeProps
  extends Omit<React.ComponentProps<'span'>, 'color'>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

export const Badge = ({
  className,
  color,
  asChild = false,
  ...props
}: BadgeProps) => {
  const Comp = asChild ? Slot : 'span';

  const isTouchDevice = useGlobalStore((state) => state.isTouchDevice);

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ color, isTouchDevice }), className)}
      {...props}
    />
  );
};

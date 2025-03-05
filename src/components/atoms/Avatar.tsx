'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';
import { FaUser } from 'react-icons/fa6';

import { cn } from '@/utils';

export interface AvatarProps
  extends Omit<
    React.ComponentProps<typeof AvatarPrimitive.Root>,
    'size' | 'children'
  > {
  size?: [6, 8, 10, 12, 14, 16, 18, 20][number];
  src?: string | null;
}

export const Avatar = ({
  className,
  size = 18,
  src,
  ...props
}: AvatarProps) => (
  <AvatarPrimitive.Root
    data-slot="avatar"
    className={cn(
      'relative flex shrink-0 overflow-hidden rounded-full',
      {
        6: 'size-6',
        8: 'size-8',
        10: 'size-10',
        12: 'size-12',
        14: 'size-14',
        16: 'size-16',
        18: 'size-18',
        20: 'size-20',
      }[size],
      className,
    )}
    {...props}
  >
    {src ? (
      <AvatarPrimitive.Image
        data-slot="avatar-image"
        src={src}
        className={cn('flex-center aspect-square size-full', className)}
      />
    ) : null}
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'bg-muted flex size-full items-center justify-center rounded-full',
        className,
      )}
    >
      <FaUser className="size-[40%] text-white" />
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
);

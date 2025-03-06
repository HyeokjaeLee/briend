'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import Image from 'next/image';
import * as React from 'react';
import { FaUser } from 'react-icons/fa6';

import { API_ROUTES } from '@/routes/api';
import { cn } from '@/utils';

import { Skeleton } from './Skeleton';

export interface AvatarProps
  extends Omit<
    React.ComponentProps<typeof AvatarPrimitive.Root>,
    'size' | 'children'
  > {
  size?: [18, 20, 26][number];
  src?: string | null;
  userId?: string;
}

export const Avatar = ({
  className,
  size = 18,
  src,
  userId,
  ...props
}: AvatarProps) => {
  const imageUrl =
    src || (userId ? API_ROUTES.GET_ACCOUNT_RANDOM_IMAGE_URL(userId) : '');

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full',
        {
          18: 'size-18',
          20: 'size-20',
          26: 'size-26',
        }[size],
        className,
      )}
      {...props}
    >
      <AvatarPrimitive.Image
        data-slot="avatar-image"
        src={imageUrl}
        asChild
        className={cn('flex-center aspect-square size-full', className)}
      >
        <Image
          unoptimized
          alt="avatar"
          width={size * 4}
          height={size * 4}
          src={imageUrl}
        />
      </AvatarPrimitive.Image>
      {imageUrl ? (
        <AvatarPrimitive.Fallback
          data-slot="avatar-fallback"
          className={cn(
            'flex size-full items-center justify-center rounded-full',
          )}
          asChild
        >
          <Skeleton />
        </AvatarPrimitive.Fallback>
      ) : (
        <div className="bg-muted flex-center size-full rounded-full">
          <FaUser className="size-[40%] text-white" />
        </div>
      )}
    </AvatarPrimitive.Root>
  );
};

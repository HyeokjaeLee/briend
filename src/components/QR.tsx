'use client';

import type { DetailedHTMLProps, ImgHTMLAttributes } from 'react';

import { Skeleton } from '@radix-ui/themes';
/* eslint-disable @next/next/no-img-element */

const QR_API = 'https://api.qrserver.com/v1/create-qr-code';

interface QRProps
  extends Pick<
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'alt' | 'className' | 'onLoad'
  > {
  size?: number;
  href: string;
}

export const QR = ({ size = 160, href, alt, className }: QRProps) => {
  return (
    <Skeleton height={`${size}px`} width={`${size}px`}>
      <img
        key={`${size}-${href}`}
        alt={`qr-${alt}`}
        className={className}
        loading="lazy"
        src={`${QR_API}/?size=${size}x${size}&data=${href}`}
      />
    </Skeleton>
  );
};

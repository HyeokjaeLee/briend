/* eslint-disable @next/next/no-img-element */

import type { ImgHTMLAttributes, DetailedHTMLProps } from 'react';

import { Skeleton } from '@radix-ui/themes';

const QR_API = 'https://api.qrserver.com/v1/create-qr-code';

interface QRProps
  extends Pick<
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'alt' | 'className' | 'onLoad'
  > {
  size?: number;
  href: string;
}

export const QR = ({ size = 160, href, alt = 'qr', className }: QRProps) => {
  const url = new URL(QR_API);
  url.searchParams.set('size', `${size}x${size}`);
  url.searchParams.set('data', href);

  return (
    <Skeleton height={`${size}px`} width={`${size}px`}>
      <img
        key={`${size}-${href}`}
        alt={alt}
        className={className}
        height={size}
        src={url.href}
        width={size}
      />
    </Skeleton>
  );
};

'use client';

/* eslint-disable @next/next/no-img-element */
import type { DetailedHTMLProps, ImgHTMLAttributes } from 'react';

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
    <img
      key={`${size}-${href}`}
      alt={`qr-${alt}`}
      className={className}
      src={`${QR_API}/?size=${size}x${size}&data=${href}`}
    />
  );
};

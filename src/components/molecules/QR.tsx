import type { ImgHTMLAttributes, DetailedHTMLProps } from 'react';

import { Skeleton } from '@radix-ui/themes';

import { CustomImage } from '../atoms/CustomImage';

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
      <CustomImage
        key={`${size}-${href}`}
        alt={alt}
        className={className}
        height={size}
        quality={100}
        src={url.href}
        width={size}
      />
    </Skeleton>
  );
};

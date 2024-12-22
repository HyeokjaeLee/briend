import type { ImgHTMLAttributes, DetailedHTMLProps } from 'react';

import { Skeleton } from '@radix-ui/themes';

import { CustomImage } from '../atoms/CustomImage';

const QR_API = 'https://api.qrserver.com/v1/create-qr-code';

export interface QRProps
  extends Pick<
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'alt' | 'className' | 'onLoad'
  > {
  size?: number;
  href: string;
  loading?: boolean;
}

export const QR = ({
  size = 160,
  href,
  alt = 'qr',
  className,
  loading,
}: QRProps) => {
  const url = new URL(QR_API);
  url.searchParams.set('size', `${size}x${size}`);
  url.searchParams.set('data', href);

  return (
    <Skeleton
      height={`${size}px`}
      //! loading 상태과 관계없이 이미지 로딩을 기다리기 위해 false 대신 undefined 사용
      loading={loading || undefined}
      width={`${size}px`}
    >
      {loading ? null : (
        <CustomImage
          key={`${size}-${href}`}
          unoptimized
          alt={alt}
          className={className}
          height={size}
          quality={100}
          src={url.href}
          width={size}
        />
      )}
    </Skeleton>
  );
};

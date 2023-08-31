import Image, { ImageProps } from 'next/image';

interface QRProps extends Pick<ImageProps, 'src' | 'alt' | 'className'> {
  size: ImageProps['width'];
}

export const QR = ({ src, alt, size, className }: QRProps) => (
  <Image
    className={`rounded-3xl ${className}`}
    src={`https://chart.apis.google.com/chart?cht=qr&chs=250x250&chl=${src}`}
    alt={alt}
    width={size}
    height={size}
  />
);

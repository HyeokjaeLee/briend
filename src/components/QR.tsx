import Image, { ImageProps } from 'next/image';

interface QRProps extends Pick<ImageProps, 'src' | 'alt' | 'className'> {
  size: ImageProps['width'];
}

export const QR = ({ src, alt, size, className }: QRProps) => {
  console.log(
    `https://chart.apis.google.com/chart?cht=qr&chs=250x250&chl=${src}`,
  );

  return (
    <Image
      className={`rounded-3xl ${className}`}
      src={`https://chart.apis.google.com/chart?cht=qr&chs=250x250&chl=http://localhost:3000?id=YUl9PcPNauVth2NyfdicVA58cS648cgx4R2qGG6LB0lcE25qfe8aCo3HUxrYGhs89zgt6Ao9c5sAAAGKQh-qTw&lang=en&userName=%EC%83%88%EC%B9%9C%EA%B5%AC`}
      alt={alt}
      width={size}
      height={size}
    />
  );
};

import type { ImageProps } from 'next/image';
import Image from 'next/image';

export type CustomImageProps = ImageProps;

export const CustomImage = ({
  alt = 'image',
  quality = 100,
  ...restProps
}: CustomImageProps) => {
  return <Image {...restProps} alt={alt} quality={quality} />;
};

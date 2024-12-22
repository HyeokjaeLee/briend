import { FaUser } from 'react-icons/fa6';

import { cn } from '@/utils';
import { Avatar } from '@radix-ui/themes';

export interface ProfileImageProps {
  src?: string;
  className?: string;
  size?: '7' | '8';
}

export const ProfileImage = ({
  src,
  className,

  size = '7',
}: ProfileImageProps) => (
  <Avatar
    className={className}
    fallback={
      <FaUser
        className={cn(
          'text-white',
          {
            7: 'size-12',
            8: 'size-14',
          }[size],
        )}
      />
    }
    radius="full"
    size={size}
    src={src}
  />
);

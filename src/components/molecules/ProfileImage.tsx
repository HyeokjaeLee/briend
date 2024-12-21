import { FaUser } from 'react-icons/fa6';

import { cn } from '@/utils/cn';
import { Avatar, Skeleton } from '@radix-ui/themes';

interface ProfileImageProps {
  src?: string;
  className?: string;
  loading?: boolean;
  size?: '7' | '8';
}

export const ProfileImage = ({
  src,
  className,
  loading,
  size = '7',
}: ProfileImageProps) => (
  <Skeleton loading={loading}>
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
  </Skeleton>
);

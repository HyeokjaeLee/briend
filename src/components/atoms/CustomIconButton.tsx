import { IconButton, type IconButtonProps } from '@radix-ui/themes';

import { cn } from '@/utils';

export interface CustomIconButtonProps extends IconButtonProps {
  activeScaleDown?: boolean;
}

export const CustomIconButton = ({
  className,
  color = 'blue',
  type = 'button',
  size = '4',
  activeScaleDown = true,
  ...restProps
}: CustomIconButtonProps) => {
  return (
    <IconButton
      {...restProps}
      className={cn(
        'disabled:cursor-not-allowed enabled:cursor-pointer outline-hidden',
        {
          'active:scale-90 transition-all duration-75': activeScaleDown,
          'size-14': size === '4',
        },
        className,
      )}
      color={color}
      size={size}
      type={type}
    />
  );
};

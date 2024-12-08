import { cn } from '@/utils/cn';
import { IconButton, type IconButtonProps } from '@radix-ui/themes';

interface CustomIconButtonProps extends IconButtonProps {
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
        'disabled:cursor-not-allowed enabled:cursor-pointer outline-none',
        {
          'active:scale-75 active:bg-slate-100 transition-all duration-75':
            activeScaleDown,
          'h-14': size === '4',
        },
        className,
      )}
      color={color}
      size={size}
      type={type}
    />
  );
};

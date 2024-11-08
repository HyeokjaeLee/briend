import { cn } from '@/utils/cn';
import { IconButton, type IconButtonProps } from '@radix-ui/themes';

export const CustomIconButton = ({
  className,
  color = 'blue',
  ...restProps
}: IconButtonProps) => {
  return (
    <IconButton
      className={cn(
        'disabled:cursor-not-allowed enabled:cursor-pointer outline-none',
        className,
      )}
      color={color}
      {...restProps}
    />
  );
};

import { cn } from '@/utils/cn';
import { IconButton, type IconButtonProps } from '@radix-ui/themes';

interface CustomIconButtonProps extends IconButtonProps {}

export const CustomIconButton = ({
  className,
  color = 'gray',
  ...restProps
}: CustomIconButtonProps) => {
  return (
    <IconButton
      className={cn(
        'disabled:cursor-not-allowed enabled:cursor-pointer',
        className,
      )}
      color={color}
      {...restProps}
    />
  );
};

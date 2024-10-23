import { cn } from '@/utils/cn';
import { Button, type ButtonProps } from '@radix-ui/themes';

export const CustomButton = ({
  className,
  color = 'blue',
  type = 'button',
  size = '4',
  ...restProps
}: ButtonProps) => {
  return (
    <Button
      className={cn(
        'disabled:cursor-not-allowed enabled:cursor-pointer font-semibold outline-none',
        {
          'h-14': size === '4',
        },
        className,
      )}
      color={color}
      size={size}
      type={type}
      {...restProps}
    />
  );
};

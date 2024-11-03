import { cn } from '@/utils/cn';
import { Button, type ButtonProps } from '@radix-ui/themes';

interface CustomButtonProps extends Omit<ButtonProps, 'size'> {
  size?: '1' | '2' | '3' | '4' | '5';
}

export const CustomButton = ({
  className,
  color = 'blue',
  type = 'button',
  size = '4',
  ...restProps
}: CustomButtonProps) => {
  return (
    <Button
      className={cn(
        'disabled:cursor-not-allowed enabled:cursor-pointer font-semibold outline-none',
        {
          'h-14': size === '4',
          'h-[60.5]': size === '5',
        },
        className,
      )}
      color={color}
      size={size === '5' ? '4' : size}
      type={type}
      {...restProps}
    />
  );
};

import { cn } from '@/utils/cn';
import { Button, type ButtonProps } from '@radix-ui/themes';

interface CustomButtonProps extends ButtonProps {}

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
        'disabled:cursor-not-allowed enabled:cursor-pointer font-semibold',
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

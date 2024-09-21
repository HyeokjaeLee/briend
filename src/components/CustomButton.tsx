import { cn } from '@/utils';
import { Button, type ButtonProps } from '@radix-ui/themes';

interface CustomButtonProps extends ButtonProps {}

export const CustomButton = ({
  className,
  color = 'gray',
  ...restProps
}: CustomButtonProps) => {
  return (
    <Button
      className={cn(
        'disabled:cursor-not-allowed enabled:cursor-pointer',
        className,
      )}
      color={color}
      size="3"
      {...restProps}
    />
  );
};

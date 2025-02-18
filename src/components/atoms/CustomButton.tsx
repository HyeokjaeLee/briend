'use client';

import { Button, type ButtonProps } from '@radix-ui/themes';

import { cn } from '@/utils';

export interface CustomButtonProps extends ButtonProps {
  activeScaleDown?: boolean;
}

export const CustomButton = ({
  className,
  color = 'blue',
  type = 'button',
  size = '4',
  activeScaleDown = true,
  ...restProps
}: CustomButtonProps) => {
  return (
    <Button
      {...restProps}
      className={cn(
        'disabled:cursor-not-allowed enabled:cursor-pointer font-semibold outline-none',
        'text-nowrap',
        {
          'active:scale-95 transition-transform duration-75 ease-out':
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

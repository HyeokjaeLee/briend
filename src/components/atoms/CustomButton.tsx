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
  disabled,
  ...restProps
}: CustomButtonProps) => {
  return (
    <Button
      {...restProps}
      disabled={disabled}
      className={cn(
        'disabled:cursor-not-allowed enabled:cursor-pointer font-semibold outline-hidden',
        'text-nowrap',
        {
          'transition-transform duration-150 ease-out': activeScaleDown,
          'h-14': size === '4',
          'active:scale-95': !disabled,
        },
        className,
      )}
      color={color}
      size={size}
      type={type}
    />
  );
};

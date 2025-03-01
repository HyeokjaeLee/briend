import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { IS_TOUCH_DEVICE } from '@/constants';
import { cn } from '@/utils';

const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center font-semibold whitespace-nowrap transition-[color,box-shadow,scale] duration-75 outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-xs active:bg-primary/85',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/90',
        outline:
          'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        ghost: 'bg-transparent',
      },
      size: {
        '14': "h-14 gap-2 rounded-xl px-4 text-lg has-[>svg]:px-3.5 [&_svg:not([class*='size-'])]:size-5",
        '8': "h-8 gap-1.5 rounded-lg px-3 text-sm has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-4",
      },
    },
  },
);

interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  onlyIcon?: boolean;
  activeScaleDown?: boolean;
}

const Button = ({
  className,
  variant: _variant,
  size: _size,
  asChild = false,
  onlyIcon = false,
  activeScaleDown = true,
  children,
  ...restProps
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';

  const variant = _variant || 'primary';

  const size = _size || '14';

  return (
    <Comp
      {...restProps}
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className }),
        activeScaleDown && 'not-[disabled]:active:scale-95',
        !IS_TOUCH_DEVICE &&
          {
            primary: 'hover:bg-primary/90',
            secondary: 'hover:bg-secondary/80',
            outline: 'hover:bg-accent/50',
            ghost: 'hover:bg-accent/90',
          }[variant],
        onlyIcon && [
          'items-center justify-center p-0',
          {
            '8': 'size-8',
            '14': 'size-14',
          }[size],
        ],
      )}
    >
      {children}
    </Comp>
  );
};

export { Button, buttonVariants };

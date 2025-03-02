import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { IS_TOUCH_DEVICE } from '@/constants';
import { cn } from '@/utils';

const buttonVariants = cva(
  [
    // Focus and state related styles
    'focus-visible:border-ring focus-visible:ring-ring/50',
    'aria-invalid:border-destructive relative',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',

    // Layout and basic properties
    'inline-flex shrink-0',
    'cursor-pointer select-none',
    'items-center justify-center',
    'whitespace-nowrap',

    // Typography
    'font-pretendard font-semibold',

    // Transition and outline
    'outline-none',
    'transition-[color,box-shadow,scale] duration-75',
    'focus-visible:ring-[3px]',

    // Disabled state
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',

    // SVG related
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        // Main style variant
        primary:
          'bg-primary text-primary-foreground shadow-xs active:bg-primary/85',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs active:bg-secondary/60',
        outline:
          'border-primary shadow-xs active:border-primary/30 border bg-transparent',
        ghost: 'active:bg-primary/10 bg-transparent',
      },
      size: {
        // Size variant
        '17': [
          'h-17 gap-2 px-4 text-lg',
          "has-[>svg]:px-3.5 [&_svg:not([class*='size-'])]:size-5",
        ],
        '14': [
          'h-14 gap-2 px-4 text-lg',
          "has-[>svg]:px-3.5 [&_svg:not([class*='size-'])]:size-5",
        ],
        '8': [
          'h-8 gap-1.5 px-3 text-sm',
          "has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-4",
        ],
      },
      activeScaleDown: {
        true: 'not-[disabled]:active:scale-90',
      },
      isTouch: {
        false: '',
      },
      onlyIcon: {
        true: 'items-center justify-center p-0',
      },
      shape: {
        pill: 'rounded-full',
        square: 'rounded-none',
        rounded: '',
      },
    },
    compoundVariants: [
      // Shape related variants
      {},
      {
        shape: 'rounded',
        size: '14',
        className: 'rounded-xl',
      },
      {
        shape: 'rounded',
        size: '8',
        className: 'rounded-lg',
      },

      // Hover effect related variants
      {
        variant: 'primary',
        isTouch: false,
        className: 'hover:bg-primary/90',
      },
      {
        variant: 'secondary',
        isTouch: false,
        className: 'hover:bg-secondary/70',
      },
      {
        variant: 'outline',
        isTouch: false,
        className: 'hover:border-primary/50',
      },
      {
        variant: 'ghost',
        isTouch: false,
        className: 'hover:bg-primary/5',
      },

      // Icon size related variants
      {
        onlyIcon: true,
        size: '8',
        className: 'size-8',
      },
      {
        onlyIcon: true,
        size: '14',
        className: 'size-14',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: '14',
      activeScaleDown: true,
      onlyIcon: false,
      shape: 'rounded',
    },
  },
);

interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  onlyIcon?: boolean;
  activeScaleDown?: boolean;
  loading?: boolean;
}

const Button = ({
  className,
  variant,
  size,
  asChild,
  onlyIcon,
  activeScaleDown,
  children,
  type = 'button',
  disabled,
  loading,
  ...restProps
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      {...restProps}
      disabled={disabled || loading}
      data-slot="button"
      type={type}
      className={cn(
        buttonVariants({
          variant,
          size,
          activeScaleDown,
          isTouch: IS_TOUCH_DEVICE,
          onlyIcon,
          className,
        }),
      )}
    >
      {loading ? <></> : children}
    </Comp>
  );
};

export { Button, buttonVariants };

'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';
import { LuCheck, LuChevronDown, LuChevronUp } from 'react-icons/lu';

import { IS_TOUCH_DEVICE } from '@/constants';
import { cn } from '@/utils';

const SelectRoot = ({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) => {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
};

const SelectTrigger = ({
  className,
  children,
  value,
  'aria-invalid': ariaInvalid,
  ...restProps
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) => {
  return (
    <SelectPrimitive.Trigger
      {...restProps}
      data-slot="select-trigger"
      aria-invalid={ariaInvalid ? 'true' : 'false'}
      className={cn(
        // Base
        'inline-flex items-center justify-between gap-2',
        'h-14 w-full px-4 py-2',
        'rounded-xl',

        // Typography
        'text-lg',
        'whitespace-nowrap',
        'text-primary',
        'font-pretendard',
        'font-medium',
        // Border & Background
        'border',
        'bg-transparent',
        'border-input',
        // States
        'outline-none',
        'cursor-pointer',
        'data-[state=open]:border-primary',
        {
          'not-[&[data-disabled]]:hover:border-primary/50': !IS_TOUCH_DEVICE,
          'data-[placeholder]:text-muted-foreground': !value,
        },
        'transition-[color,box-shadow,border]',
        'duration-150',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50',
        // Data attributes
        'aria-invalid:border-destructive',
        // Child elements
        '*:data-[slot=select-value]:line-clamp-1',
        '*:data-[slot=select-value]:flex',
        '*:data-[slot=select-value]:items-center',
        '*:data-[slot=select-value]:gap-2',
        // SVG styles
        '[&_svg:not([class*="text-"])]:text-muted-foreground',
        '[&_svg:not([class*="size-"])]:size-4',
        '[&_svg]:pointer-events-none',
        '[&_svg]:shrink-0',
        // Custom
        className,
      )}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <LuChevronDown className="text-input size-5" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
};

const SelectContent = ({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          // Base
          'relative',
          'z-50',
          'rounded-xl',
          'border',
          // Layout & Size
          'max-h-140',
          'min-w-[8rem]',
          'overflow-hidden',
          // Colors
          'bg-background',
          'text-background-foreground',
          // Shadows
          'shadow-md',

          // Animations
          'data-[side=bottom]:animate-fade-down',
          'data-[side=left]:animate-fade-left',
          'data-[side=right]:animate-fade-right',
          'data-[side=top]:animate-fade-up',
          'data-[state=open]:animate-duration-150',

          // Popper positioning
          position === 'popper' &&
            'data-[side=bottom]:translate-y-4 data-[side=left]:-translate-x-4 data-[side=right]:translate-x-4 data-[side=top]:-translate-y-4',
          // Custom
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
};

const SelectItem = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) => {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        // Base
        'relative',
        'flex',
        'w-full',
        // Layout & Spacing
        'items-center',
        'gap-2',
        'rounded-sm',
        'py-1.5',
        'min-h-14',
        'pl-4',
        'pr-10',
        // Typography
        'text-lg',
        'whitespace-nowrap',
        'text-primary',
        'font-pretendard',
        'font-medium',
        // Interaction
        'cursor-pointer',
        'select-none',
        'outline-hidden',
        // States
        'focus:bg-accent',
        'focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none',
        'data-[disabled]:opacity-50',
        // Child elements
        '*:[span]:last:flex',
        '*:[span]:last:items-center',
        '*:[span]:last:gap-2',
        // SVG styles
        '[&_svg:not([class*="text-"])]:text-muted-foreground',
        '[&_svg:not([class*="size-"])]:size-4',
        '[&_svg]:pointer-events-none',
        '[&_svg]:shrink-0',
        // Custom
        className,
      )}
      {...props}
    >
      <span className="absolute right-4 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <LuCheck className="text-primary size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
};

const SelectScrollUpButton = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) => {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        // Layout
        'flex-center',
        // Spacing
        'h-14',
        // Interaction
        'cursor-pointer',
        // Custom
        className,
      )}
      {...props}
    >
      <LuChevronUp className="size-5" />
    </SelectPrimitive.ScrollUpButton>
  );
};

const SelectScrollDownButton = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) => {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        // Layout
        'flex-center',

        // Spacing
        'h-14',
        // Interaction
        'cursor-pointer',
        // Custom
        className,
      )}
      {...props}
    >
      <LuChevronDown className="size-5" />
    </SelectPrimitive.ScrollDownButton>
  );
};

export interface SelectProps<T extends string>
  extends Omit<
    React.ComponentProps<typeof SelectPrimitive.Trigger>,
    'children'
  > {
  placeholder?: string;
  value?: T;
  options?: {
    label: string;
    value: T;
  }[];
  onValueChange: (value: T) => void;
}

export const Select = <T extends string>({
  options,
  placeholder,
  value,
  disabled,
  onValueChange,
  ...restProps
}: SelectProps<T>) => {
  const selectedOption = options?.find((option) => option.value === value);

  return (
    <SelectRoot disabled={disabled} onValueChange={onValueChange}>
      <SelectTrigger {...restProps} value={value}>
        {selectedOption?.label || placeholder}
      </SelectTrigger>
      {options ? (
        <SelectContent>
          {options.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      ) : null}
    </SelectRoot>
  );
};

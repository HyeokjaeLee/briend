import type { RefAttributes } from 'react';

import { cn } from '@/utils';
import { TextField } from '@radix-ui/themes';

export type InputProps = Omit<
  TextField.RootProps & RefAttributes<HTMLInputElement>,
  'size' | 'variant'
>;

export const Input = ({ className, ...restProps }: InputProps) => {
  return (
    <TextField.Root
      className={cn('h-14 w-full rounded-xl px-1', className)}
      size="3"
      variant="soft"
      {...restProps}
    />
  );
};

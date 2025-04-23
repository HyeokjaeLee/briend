import { RiLoader3Fill } from 'react-icons/ri';

import { cn } from '@/utils';

export interface SpinnerProps {
  className?: string;
}

export const Spinner = ({ className }: SpinnerProps) => {
  return (
    <RiLoader3Fill
      aria-label="loading"
      className={cn('text-primary size-16 animate-spin cursor-wait', className)}
    />
  );
};

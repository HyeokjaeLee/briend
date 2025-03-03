import { Slot } from '@radix-ui/themes';

import { cn } from '@/utils';

export interface SkeletonProps extends React.ComponentProps<'div'> {
  loading?: boolean;
}

export const Skeleton = ({
  className,
  children,
  loading,
  ...props
}: SkeletonProps) => {
  if (loading === false) return children;

  const Comp = children ? Slot : 'div';

  return (
    <Comp
      data-slot="skeleton"
      role="none"
      className={cn(
        'relative cursor-wait',
        'overflow-hidden',
        'before:absolute',
        'before:inset-0',
        'before:bg-primary/10',
        'before:animate-pulse',
        'before:z-[1]',
        '[&>*]:relative',
        '[&>*]:opacity-0',
        '[&>*]:z-[2]',
        {
          'rounded-md': !children,
        },
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

Skeleton.displayName = 'Skeleton';

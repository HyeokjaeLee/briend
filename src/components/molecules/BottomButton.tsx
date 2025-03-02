import { cn } from '@/utils';

import { Button, type ButtonProps } from '../atoms/Button';
import { CustomBottomNav } from './CustomBottomNav';

export type BottomButtonProps = Omit<ButtonProps, 'activeScaleDown'>;

export const BottomButton = ({
  className,
  ...restProps
}: BottomButtonProps) => {
  return (
    <CustomBottomNav className="h-17 border-t-0">
      <Button
        activeScaleDown={false}
        className={cn('size-full rounded-none text-xl', className)}
        {...restProps}
      />
    </CustomBottomNav>
  );
};

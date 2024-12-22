import { cn } from '@/utils';

import { CustomButton, type CustomButtonProps } from '../atoms/CustomButton';

import { CustomBottomNav } from './CustomBottomNav';

export type BottomButtonProps = Omit<CustomButtonProps, 'activeScaleDown'>;

export const BottomButton = ({
  className,
  ...restProps
}: BottomButtonProps) => {
  return (
    <CustomBottomNav className="h-17 border-t-0">
      <CustomButton
        activeScaleDown={false}
        className={cn('size-full rounded-none text-xl', className)}
        {...restProps}
      />
    </CustomBottomNav>
  );
};

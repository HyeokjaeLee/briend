import { cn } from '@/utils/cn';

import { CustomBottomNav } from '../atoms/CustomBottomNav';
import { CustomButton, type CustomButtonProps } from '../atoms/CustomButton';

type BottomButtonProps = Omit<CustomButtonProps, 'activeScaleDown'>;

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

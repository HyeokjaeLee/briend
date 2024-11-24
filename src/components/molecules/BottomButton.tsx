import { cn } from '@/utils/cn';

import { CustomBottomNav } from '../atoms/CustomBottomNav';
import { CustomButton, type CustomButtonProps } from '../atoms/CustomButton';

type BottomButtonProps = Omit<CustomButtonProps, ''>;

export const BottomButton = ({
  className,
  ...restProps
}: BottomButtonProps) => {
  return (
    <CustomBottomNav className="h-20 border-t-0">
      <CustomButton
        className={cn('size-full rounded-none text-xl', className)}
        {...restProps}
      />
    </CustomBottomNav>
  );
};

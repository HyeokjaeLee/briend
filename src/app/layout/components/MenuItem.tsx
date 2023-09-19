import { Button } from '@hyeokjaelee/pastime-ui';

interface MenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const MenuItem = ({ children, ...restButtonProps }: MenuItemProps) => (
  <li>
    <Button {...restButtonProps} theme="clear" size="large">
      <div className="flex items-center justify-start w-60 gap-2">
        {children}
      </div>
    </Button>
  </li>
);

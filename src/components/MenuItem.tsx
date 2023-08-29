'use client';

import { Button } from '@hyeokjaelee/pastime-ui';

interface MenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const MenuItem = ({ children, onClick }: MenuItemProps) => (
  <li>
    <Button theme="clear" size="large" onClick={onClick}>
      <div className="flex items-center justify-start w-60 gap-2">
        {children}
      </div>
    </Button>
  </li>
);

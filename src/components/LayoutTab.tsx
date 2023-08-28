'use client';

import { usePathname } from 'next/navigation';

import { useAuthStore } from '@/store/authStore';
import { Tab } from '@hyeokjaelee/pastime-ui';

export const LayoutTab = () => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const pathname = usePathname();
  return (
    <Tab>
      <Tab.Item disabled={!isLogin} active={pathname === '/private/chat'}>
        Chat
      </Tab.Item>
      <Tab.Item>About</Tab.Item>
    </Tab>
  );
};

'use client';

import { usePathname, useRouter } from 'next/navigation';

import { useAuthStore } from '@/hooks/useAuthStore';
import { Tab } from '@hyeokjaelee/pastime-ui';

export const LayoutTab = () => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Tab size="medium">
      <Tab.Item
        disabled={!isLogin}
        active={pathname === '/private/chat'}
        onClick={() => router.push('/private/chat')}
      >
        Chat
      </Tab.Item>
      <Tab.Item>About</Tab.Item>
    </Tab>
  );
};

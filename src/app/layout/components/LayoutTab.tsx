import { usePathname, useRouter } from 'next/navigation';

import { Tab } from '@hyeokjaelee/pastime-ui';

export const LayoutTab = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Tab size="small" fixedDarkMode="dark">
      <Tab.Item
        active={pathname === '/about'}
        onClick={() => router.push('/about')}
      >
        About
      </Tab.Item>
    </Tab>
  );
};

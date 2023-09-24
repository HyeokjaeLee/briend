import { usePathname, useRouter } from 'next/navigation';

import { Tab } from '@hyeokjaelee/pastime-ui';

export const LayoutTab = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Tab fixedDarkMode="dark">
      <Tab.Item
        active={pathname === '/about'}
        onClick={() => router.push('/about')}
      >
        About
      </Tab.Item>
    </Tab>
  );
};

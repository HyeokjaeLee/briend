import { useRouter } from 'next/navigation';

import { Tab } from '@hyeokjaelee/pastime-ui';

export const LayoutTab = () => {
  const router = useRouter();
  return (
    <Tab fixedDarkMode="dark" size="small">
      <Tab.Item onClick={() => router.push('/about')}>About</Tab.Item>
    </Tab>
  );
};

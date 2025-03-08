import { InstallPWAButton } from '@/components/InstallPWAButton';

export const metadata = {
  title: 'Briend',
  description: '언어 친구를 만나 서로의 언어를 배우는 앱',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Briend',
  },
  applicationName: 'Briend',
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

export default function Home() {
  return (
    <main>
      <section className="mt-8 flex justify-center">
        <InstallPWAButton />
      </section>
    </main>
  );
}

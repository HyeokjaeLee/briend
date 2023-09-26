import './globals.css';
import '@hyeokjaelee/pastime-ui/style.css';

import type { Metadata } from 'next';

import { Analytics } from './layout/components/Analytics';
import { GlobalMenu } from './layout/components/GlobalMenu';
import { GlobalNav } from './layout/components/GlobalNav';
import { GlobalProvider } from './layout/components/GlobalProvider';

export const metadata: Metadata = {
  title: 'briend',
  description: 'Talk to new people without language barriers',
  manifest: '/manifest.json',

  viewport:
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://briend.vercel.app/',
    title: 'briend',
    description: 'Talk to new people without language barriers',
    siteName: 'briend',
    images: [
      {
        url: '/assets/resources/tokyo-picture.jpeg',
        alt: 'briend',
      },
    ],
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <html lang="ko" className="text-sm sm:text-base w-full h-full">
    <Analytics />
    <GlobalProvider>
      <body className="bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-slate-300 font-pretendard break-keep font-medium w-full h-full flex flex-col overflow-hidden">
        <GlobalNav />
        <main className="flex-1 h-page overflow-auto">{children}</main>
      </body>
      <GlobalMenu />
    </GlobalProvider>
  </html>
);
export default Layout;

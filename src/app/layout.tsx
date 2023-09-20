import './globals.css';
import '@hyeokjaelee/pastime-ui/style.css';

import type { Metadata } from 'next';

import { GlobalMenu } from './layout/components/GlobalMenu';
import { GlobalNav } from './layout/components/GlobalNav';
import { GlobalProvider } from './layout/components/GlobalProvider';

export const metadata: Metadata = {
  title: 'Briend',
  description: 'Talk to new people without language barriers',
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <html lang="en" className="text-sm sm:text-base w-full h-full">
    <GlobalProvider>
      <body className="bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-slate-300 font-pretendard break-keep font-medium w-full h-full flex flex-col">
        <GlobalNav />
        <main className="flex-1 h-page overflow-auto">{children}</main>
      </body>
      <GlobalMenu />
    </GlobalProvider>
  </html>
);
export default Layout;

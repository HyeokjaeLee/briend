import './globals.css';
import '@hyeokjaelee/pastime-ui/style.css';

import type { Metadata } from 'next';

import { GlobalMenu } from '@/components/GlobalMenu';
import { GlobalNav } from '@/components/GlobalNav';
import { GlobalProvider } from '@/components/GlobalProvider';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <html lang="en">
    <GlobalProvider>
      <body className="bg-slate-700">
        <GlobalNav />
        {children}
      </body>
      <GlobalMenu />
    </GlobalProvider>
  </html>
);
export default Layout;

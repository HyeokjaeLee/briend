import './globals.css';

import type { Metadata } from 'next';

import { dir } from 'i18next';

import type { ReactElement } from 'react';

import type { LANGUAGE } from '@/constants/language';
import { cn } from '@/utils/cn';

import { languages } from '../i18n/settings';

import { BottomNav } from './_components/BottomNav';
import { pretendard } from './_components/Font';
import { GlobalHeader } from './_components/GlobalHeader';
import { GlobalLoading } from './_components/GlobalLoading';
import { GlobalProvider } from './_components/GlobalProvider';
import { ToastProvider } from './_components/ToastProvider';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export const generateStaticParams = () => languages.map((lng) => ({ lng }));

interface RootLayoutProps {
  children: ReactElement;
  params: Promise<{
    lng: LANGUAGE;
  }>;
}

const RootLayout = async ({ children, params }: Readonly<RootLayoutProps>) => {
  const { lng } = await params;

  return (
    <html
      className={cn(pretendard.variable, 'size-full')}
      dir={dir(lng)}
      lang={lng}
    >
      <body className={cn(pretendard.className, 'size-full bg-zinc-50 dark')}>
        <GlobalProvider className="flex size-full bg-zinc-50">
          <div className="flex-1" />
          <div className="relative flex h-fit max-h-dvh min-h-full w-full max-w-xl flex-col overflow-hidden bg-slate-850 text-slate-50 shadow-xl">
            <GlobalHeader />
            <ToastProvider />
            {children}
            <BottomNav />
            <GlobalLoading />
          </div>
          <div className="flex-1" />
        </GlobalProvider>
      </body>
    </html>
  );
};

export default RootLayout;

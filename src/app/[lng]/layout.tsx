import '@/styles/globals.css';

import { dir } from 'i18next';
import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { type ReactElement, Suspense } from 'react';

import { PageLoadingTemplate } from '@/components';
import { pretendard } from '@/configs/font';
import { getTranslation } from '@/configs/i18n/server';
import type { LANGUAGE } from '@/constants';
import { cn } from '@/utils';

import { languages } from '../../configs/i18n/settings';
import { BottomNav } from './_components/BottomNav';
import { CenterContainer } from './_components/CenterContainer';
import { GlobalHeader } from './_components/GlobalHeader';
import { GlobalListener } from './_components/GlobalListener';
import { GlobalLoading } from './_components/GlobalLoading';
import { GlobalModals } from './_components/GlobalModals';
import { GlobalProvider } from './_components/GlobalProvider';
import { MainContainer } from './_components/MainContainer';
import { MountAction } from './_components/MountAction';
import { RightSide } from './_components/RightSide';
import { SidePanel } from './_components/SidePanel';
import { ToastProvider } from './_components/ToastProvider';

interface PropsWithParams {
  params: Promise<{
    lng: LANGUAGE;
  }>;
}

export const generateMetadata = async ({ params }: PropsWithParams) => {
  const { lng } = await params;
  const headersList = await headers();
  const { t } = await getTranslation('meta', lng);

  const pathname = headersList.get('pure-path') || '';

  const alternatesLanguages = languages.reduce(
    (acc, lang) => ({
      ...acc,
      [lang]: `/${lang}${pathname}`,
    }),
    {} as Record<LANGUAGE, string>,
  );

  const keywords = new Array(9).fill(null).map((_, index) => {
    return t(`root.keywords.${index}`);
  });

  return {
    title: `BRIEND - ${t('root.title')}`,
    authors: [
      {
        name: 'Hyeokjae Lee',
        url: 'https://hyeokjaelee.github.io',
      },
    ],
    keywords,
    description: t('root.description'),
    alternates: {
      languages: alternatesLanguages,
    },
    manifest: `/manifest/${lng}.json`,
    category: 'social',
  } satisfies Metadata;
};

export const generateStaticParams = () => languages.map((lng) => ({ lng }));

interface RootLayoutProps extends PropsWithParams {
  children: ReactElement;
}

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
  params,
}: Readonly<RootLayoutProps>) {
  const { lng } = await params;

  return (
    <html
      className={cn(pretendard.className, pretendard.variable, 'size-full')}
      dir={dir(lng)}
      lang={lng}
    >
      <body className="flex size-full overflow-hidden text-slate-900">
        <Suspense>
          <RightSide lng={lng} />
          <GlobalLoading />
          <GlobalProvider>
            <GlobalListener />
            <MountAction />
            <div className="flex-2 max-h-cdvh relative flex h-full w-fit max-w-screen-xl">
              <CenterContainer>
                <GlobalHeader />
                <ToastProvider />
                <Suspense fallback={<PageLoadingTemplate />}>
                  <GlobalModals />
                  <MainContainer>{children}</MainContainer>
                </Suspense>
                <BottomNav />
              </CenterContainer>
              <SidePanel />
            </div>
          </GlobalProvider>
        </Suspense>
      </body>
    </html>
  );
}

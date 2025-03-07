import '@/styles/globals.css';

import { dir } from 'i18next';
import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { type ReactElement, Suspense } from 'react';

import { PageLoadingTemplate } from '@/components';
import { pretendard } from '@/configs/font';
import { LANGUAGE } from '@/constants';
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

  const pathname = headersList.get('pure-path') || '';

  const alternatesLanguages = languages.reduce(
    (acc, lang) => ({
      ...acc,
      [lang]: `/${lang}${pathname}`,
    }),
    {} as Record<LANGUAGE, string>,
  );

  return {
    title: `Briend - ${
      {
        [LANGUAGE.KOREAN]: '간편 번역 채팅',
        [LANGUAGE.ENGLISH]: 'Simple Translation Chat',
        [LANGUAGE.JAPANESE]: '簡単翻訳チャット',
        [LANGUAGE.CHINESE]: '简单翻译聊天',
        [LANGUAGE.VIETNAMESE]: 'Chat dịch đơn giản',
        [LANGUAGE.THAI]: 'การสนทนาของการแปลงง่าย',
      }[lng]
    }`,
    description: {
      [LANGUAGE.KOREAN]:
        '스캔한번으로 새로만난 사람과 같은 언어로 대화해보세요.',
      [LANGUAGE.ENGLISH]: 'Chat with new people in the same language as you.',
      [LANGUAGE.JAPANESE]: '新しい人と同じ言語で話しましょう。',
      [LANGUAGE.CHINESE]: '与新认识的人用同一种语言聊天。',
      [LANGUAGE.VIETNAMESE]:
        'Chat với người mới kết nối bằng cùng một ngôn ngữ.',
      [LANGUAGE.THAI]: 'สนทนากับคนใหม่โดยใช้ภาษาเดียวกัน',
    }[lng],
    alternates: {
      languages: alternatesLanguages,
    },
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
      className={cn(pretendard.className, pretendard.variable, 'h-dvh w-full')}
      dir={dir(lng)}
      lang={lng}
    >
      <body className="flex h-dvh w-full overflow-hidden">
        <Suspense>
          <RightSide lng={lng} />
          <GlobalLoading />
          <GlobalProvider>
            <GlobalListener />
            <MountAction />
            <div className="flex-2 relative flex size-full w-fit max-w-screen-xl">
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

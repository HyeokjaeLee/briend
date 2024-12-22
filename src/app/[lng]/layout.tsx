import './globals.css';

import type { Metadata } from 'next';

import { dir } from 'i18next';
import { headers } from 'next/headers';

import type { ReactElement } from 'react';

import { LANGUAGE } from '@/constants';
import { cn } from '@/utils';
import { Theme } from '@radix-ui/themes';

import { languages } from '../i18n/settings';

import { BottomNav } from './_components/BottomNav';
import { pretendard } from './_components/Font';
import { GlobalHeader } from './_components/GlobalHeader';
import { GlobalLoading } from './_components/GlobalLoading';
import { GlobalModals } from './_components/GlobalModals';
import { GlobalProvider } from './_components/GlobalProvider';
import { GlobalSuspense } from './_components/GlobalSuspense';
import { MainContainer } from './_components/MainContainer';
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
  rightSide: ReactElement;
}

const RootLayout = async ({
  children,
  params,
  rightSide,
}: Readonly<RootLayoutProps>) => {
  const { lng } = await params;

  return (
    <html
      className={cn(pretendard.className, pretendard.variable, 'size-full')}
      dir={dir(lng)}
      lang={lng}
    >
      <Theme asChild className="flex size-full" scaling="90%">
        <body>
          <GlobalSuspense>
            <GlobalProvider>
              <aside className="hidden flex-1 bg-slate-100 xl:block" />
              <div
                className={cn(
                  'relative flex size-full max-h-cdvh min-h-cdvh w-full max-w-screen-sm flex-col overflow-hidden text-slate-900',
                  'flex-1 shadow-none sm:shadow-lg',
                )}
              >
                <GlobalLoading />
                <GlobalHeader />
                <ToastProvider />
                <GlobalModals />
                <MainContainer>{children}</MainContainer>
                <BottomNav />
              </div>
              <aside className="hidden flex-1 bg-slate-100 sm:block">
                {rightSide}
              </aside>
            </GlobalProvider>
          </GlobalSuspense>
        </body>
      </Theme>
    </html>
  );
};

export default RootLayout;

import { FaGithub } from 'react-icons/fa';
import { RiMobileDownloadFill } from 'react-icons/ri';

import { Button, DotLottie } from '@/components';
import { getTranslation } from '@/configs/i18n/server';
import type { LANGUAGE } from '@/constants';

interface RightSideProps {
  lng: LANGUAGE;
}

export const RightSide = async ({ lng }: RightSideProps) => {
  const { t } = await getTranslation('layout', lng);

  return (
    <aside className="hidden h-dvh flex-1 flex-col overflow-auto xl:flex">
      <div className="flex-center flex-1 flex-col gap-2">
        <DotLottie src="/assets/lottie/translate.lottie" className="size-100" />
        <div className="container px-4 text-center">
          <h2 className="mb-6 text-2xl font-bold tracking-tighter sm:text-3xl">
            {t('start-chat')}
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-[600px]">
            {t('start-chat-description')}
            <br />
            {t('download-app')}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button className="gap-2">
              <FaGithub className="size-7" />
              Github
            </Button>
            <Button variant="outline" className="gap-2">
              <RiMobileDownloadFill className="size-7" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

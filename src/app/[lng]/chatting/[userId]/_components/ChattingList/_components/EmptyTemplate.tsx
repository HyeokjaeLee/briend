import { useTranslation } from 'react-i18next';

import { DotLottie } from '@/components';

export const EmptyTemplate = () => {
  const { t } = useTranslation('chatting');

  return (
    <div className="flex-center size-full flex-col p-4">
      <DotLottie className="size-36" src="/assets/lottie/empty.lottie" />
      <section className="text-center text-slate-500">
        <h3 className="text-lg font-semibold">{t('empty-title')}</h3>
        <p className="text-sm">{t('empty-description')}</p>
      </section>
    </div>
  );
};

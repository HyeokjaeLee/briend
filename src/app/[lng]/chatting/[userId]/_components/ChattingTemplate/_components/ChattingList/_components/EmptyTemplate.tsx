import { useTranslation } from 'react-i18next';

import { DotLottie } from '@/components';

export const EmptyTemplate = () => {
  const { t } = useTranslation('chatting');

  return (
    <div className="size-full flex-col p-4 flex-center">
      <DotLottie className="size-72" src="/assets/lottie/empty.lottie" />
      <section className="text-center text-slate-500">
        <h3 className="text-xl font-semibold">{t('empty-title')}</h3>
        <p>{t('empty-description')}</p>
      </section>
    </div>
  );
};

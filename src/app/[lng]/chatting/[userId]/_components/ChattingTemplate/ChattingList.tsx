import { useTranslation } from '@/app/i18n/client';
import { Lottie } from '@/components';

import EmptyLottie from './_assets/empty.json';
export const ChattingList = () => {
  const { t } = useTranslation('chatting');

  return (
    <div className="size-full flex-col gap-12 p-4 flex-center">
      <Lottie loop animationData={EmptyLottie} className="w-full" />
      <section className="text-center text-slate-500">
        <h3 className="text-xl font-semibold">{t('empty-title')}</h3>
        <p>{t('empty-description')}</p>
      </section>
    </div>
  );

  return (
    <ul>
      <li>1</li>
      <li>2</li>
    </ul>
  );
};

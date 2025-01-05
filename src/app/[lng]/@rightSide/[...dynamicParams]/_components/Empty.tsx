import { useTranslation } from 'react-i18next';

import Logo from '@/svgs/logo.svg';

export default function EmptyTemplate() {
  const { t } = useTranslation('layout');

  return (
    <div className="size-full flex-col gap-4 bg-white flex-center">
      <Logo className="w-40" />
      <div className="text-center">
        <h2 className="mb-1 text-lg font-semibold">{t('empty')}</h2>
        <p className="text-sm text-gray-500">{t('empty-description')}</p>
      </div>
    </div>
  );
}

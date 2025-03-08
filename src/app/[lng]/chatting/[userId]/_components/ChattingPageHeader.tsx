'use client';

import { BackHeader, Tabs } from '@/components';
import { useTranslation } from '@/configs/i18n/client';

import { useTranslateSearchParam } from '../_hooks/useTranslateSearchParam';

interface ChattingPageHeaderProps {
  sidePanel?: boolean;
  name: string;
}

export const ChattingPageHeader = ({
  sidePanel,
  name,
}: ChattingPageHeaderProps) => {
  const { handleTranslate, isOriginal } = useTranslateSearchParam({
    sidePanel,
  });

  const { t } = useTranslation('chatting');

  return (
    <BackHeader className="relative justify-between" sidePanel={sidePanel}>
      <div className="flex-center w-fit gap-3">
        <h1 className="truncate text-nowrap font-semibold">{name}</h1>
      </div>
      <Tabs
        value={isOriginal ? 'original' : 'translated'}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        onValueChange={(value) => {
          handleTranslate(value === 'original');
        }}
      >
        <Tabs.Item value="original">{t('original')}</Tabs.Item>
        <Tabs.Item value="translated">{t('translated')}</Tabs.Item>
      </Tabs>
    </BackHeader>
  );
};

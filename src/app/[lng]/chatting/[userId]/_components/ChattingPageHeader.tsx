'use client';

import { Avatar, BackHeader, Tabs } from '@/components';
import { trpc } from '@/configs/trpc';
import { LANGUAGE_NAME } from '@/constants';
import { useThisSidePanel } from '@/hooks';

import type { ReceiverData } from '../_hooks/useReceiverData';
import { useTranslateSearchParam } from '../_hooks/useTranslateSearchParam';

interface ChattingPageHeaderProps {
  receiverData: ReceiverData;
}

export const ChattingPageHeader = ({
  receiverData,
}: ChattingPageHeaderProps) => {
  const { handleTranslate, isReceiverLanguage } = useTranslateSearchParam();

  const { isSidePanel } = useThisSidePanel();

  const { data: myLanguage } = trpc.chat.myLanguage.useQuery({
    receiverId: receiverData.id,
  });

  return (
    <BackHeader className="relative justify-between" sidePanel={isSidePanel}>
      <div className="flex-center w-fit gap-2">
        <Avatar
          size={6}
          src={receiverData.profileImage}
          userId={receiverData.id}
        />
        <h2 className="max-w-25 truncate text-nowrap text-lg font-medium">
          {receiverData.name}
        </h2>
      </div>
      {myLanguage ? (
        <Tabs
          value={isReceiverLanguage ? 'receiver-language' : 'my-language'}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          onValueChange={(value) => {
            handleTranslate(value === 'receiver-language');
          }}
        >
          <Tabs.Item value="receiver-language">
            {LANGUAGE_NAME[receiverData.language]}
          </Tabs.Item>
          <Tabs.Item value="my-language">{LANGUAGE_NAME[myLanguage]}</Tabs.Item>
        </Tabs>
      ) : null}
    </BackHeader>
  );
};

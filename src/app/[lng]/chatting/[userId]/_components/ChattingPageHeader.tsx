'use client';

import { BackHeader } from '@/components';

interface ChattingPageHeaderProps {
  userId: string;
}

export const ChattingPageHeader = ({ userId }: ChattingPageHeaderProps) => {
  console.info(userId);

  return (
    <BackHeader className="justify-between">
      <div className="flex-center w-fit gap-3">
        <h1 className="truncate text-nowrap font-semibold">{'test'}</h1>
      </div>
    </BackHeader>
  );
};

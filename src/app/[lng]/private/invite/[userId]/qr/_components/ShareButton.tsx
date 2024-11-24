'use client';

import { RiShareFill } from 'react-icons/ri';

import { BottomButton } from '@/components/molecules/BottomButton';

export const ShareButton = () => {
  return (
    <BottomButton activeScaleDown={false}>
      <RiShareFill className="size-7" /> 공유하기
    </BottomButton>
  );
};

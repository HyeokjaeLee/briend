import { Suspense } from 'react';

import { LoadingTemplate } from '@/components';

import { NoNickNameModal } from './_components/NoNickNameModal';

export default function ChattingJoinPage() {
  return (
    <Suspense fallback={<LoadingTemplate />}>
      <NoNickNameModal />
    </Suspense>
  );
}

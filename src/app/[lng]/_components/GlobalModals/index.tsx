'use client';

import { BackNoticeModal } from './_components/BackNoticeModal';
import { EscapeErrorModal } from './_components/EscapeErrorModal';

export const GlobalModals = () => {
  return (
    <>
      <BackNoticeModal />
      <EscapeErrorModal />
    </>
  );
};

import { useShallow } from 'zustand/shallow';

import { Button, ConfirmModal } from '@/components';
import { useTranslation } from '@/configs/i18n/client';
import { useCustomRouter } from '@/hooks';
import { useGlobalModalStore } from '@/stores';

export const BackNoticeModal = () => {
  const [
    backNoticeInfo,
    setBackNoticeInfo,
    isBackNoticeModalOpen,
    setIsBackNoticeModalOpen,
  ] = useGlobalModalStore(
    useShallow((state) => [
      state.backNoticeInfo,
      state.setBackNoticeInfo,
      state.isBackNoticeModalOpen,
      state.setIsBackNoticeModalOpen,
    ]),
  );

  const handleClose = () => setIsBackNoticeModalOpen(false);
  const router = useCustomRouter();
  const { t } = useTranslation('global-modal');

  return (
    <ConfirmModal
      footer={
        <footer className="mt-auto flex w-full justify-end gap-2">
          <Button className="flex-1" onClick={handleClose}>
            {t('back-notice-close-button')}
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => {
              handleClose();
              setBackNoticeInfo(null);

              router.back();
            }}
          >
            {t('back-notice-exit-button')}
          </Button>
        </footer>
      }
      message={backNoticeInfo?.message || ''}
      opened={isBackNoticeModalOpen}
      title={backNoticeInfo?.title || ''}
      onClose={handleClose}
    />
  );
};

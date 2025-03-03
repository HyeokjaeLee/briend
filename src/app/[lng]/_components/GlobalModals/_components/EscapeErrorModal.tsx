'use client';

import { useShallow } from 'zustand/shallow';

import { Button, ConfirmModal } from '@/components';
import { useTranslation } from '@/configs/i18n/client';
import { ROUTES } from '@/routes/client';
import { useGlobalModalStore } from '@/stores';

export const EscapeErrorModal = () => {
  const { t } = useTranslation('global-modal');
  const [isEscapeErrorModalOpen, setIsEscapeErrorModalOpen] =
    useGlobalModalStore(
      useShallow((state) => [
        state.isEscapeErrorModalOpen,
        state.setIsEscapeErrorModalOpen,
      ]),
    );

  return (
    <ConfirmModal
      footer={
        <Button
          className="w-full"
          onClick={() => {
            location.replace(ROUTES.FRIEND_LIST.pathname);
            setIsEscapeErrorModalOpen(false);
          }}
        >
          {t('escape-modal-button')}
        </Button>
      }
      message={t('escape-modal-message')}
      opened={isEscapeErrorModalOpen}
      rootClassName="z-40"
      title={t('escape-modal-title')}
      onClose={() => setIsEscapeErrorModalOpen(false)}
    />
  );
};

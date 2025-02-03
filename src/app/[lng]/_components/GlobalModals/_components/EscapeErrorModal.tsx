'use client';

import { useShallow } from 'zustand/shallow';

import { useTranslation } from '@/app/i18n/client';
import { ConfirmModal, CustomButton } from '@/components';
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
        <CustomButton
          className="w-full"
          size="4"
          onClick={() => {
            location.replace(ROUTES.FRIEND_LIST.pathname);
            setIsEscapeErrorModalOpen(false);
          }}
        >
          {t('escape-modal-button')}
        </CustomButton>
      }
      message={t('escape-modal-message')}
      opened={isEscapeErrorModalOpen}
      rootClassName="z-40"
      title={t('escape-modal-title')}
      onClose={() => setIsEscapeErrorModalOpen(false)}
    />
  );
};

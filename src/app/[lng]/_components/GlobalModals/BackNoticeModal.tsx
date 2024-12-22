import { useShallow } from 'zustand/shallow';

import { CustomButton } from '@/components/atoms/CustomButton';
import { Modal } from '@/components/atoms/Modal';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { useGlobalModalStore } from '@/stores/global-modal';

export const BackNoticeModal = () => {
  const [
    backNoticeInfo,
    setBackNoticeInfo,
    isGlobalModalOpen,
    setIsGlobalModalOpen,
  ] = useGlobalModalStore(
    useShallow((state) => [
      state.backNoticeInfo,
      state.setBackNoticeInfo,
      state.isGlobalModalOpen,
      state.setIsGlobalModalOpen,
    ]),
  );

  const handleClose = () => setIsGlobalModalOpen(false);
  const router = useCustomRouter();

  return (
    <Modal
      className="whitespace-pre-line"
      open={isGlobalModalOpen}
      title={backNoticeInfo?.title}
      onClose={handleClose}
    >
      {backNoticeInfo?.message}
      <footer className="mt-5 flex w-full justify-end gap-2">
        <CustomButton size="3" onClick={handleClose}>
          취소
        </CustomButton>
        <CustomButton
          size="3"
          variant="outline"
          onClick={() => {
            handleClose();
            setBackNoticeInfo(null);

            router.back();
          }}
        >
          나가기
        </CustomButton>
      </footer>
    </Modal>
  );
};

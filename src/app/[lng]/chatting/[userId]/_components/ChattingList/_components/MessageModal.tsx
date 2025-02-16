import { CustomButton, Modal } from '@/components';

interface MessageModalProps {
  selectedMessageId?: string;
  onClose?: () => void;
  onClickDeleteModeButton?: (selectedMessageId: string) => void;
}

export const MessageModal = ({
  selectedMessageId,
  onClose,
  onClickDeleteModeButton,
}: MessageModalProps) => {
  return (
    <Modal hasCloseButton open={!!selectedMessageId} onClose={onClose}>
      <section>ss</section>
      <footer className="mt-8 w-full">
        <CustomButton
          className="w-full"
          color="red"
          onClick={() => {
            onClickDeleteModeButton?.(selectedMessageId!);
            onClose?.();
          }}
        >
          삭제
        </CustomButton>
      </footer>
    </Modal>
  );
};

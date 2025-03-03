import { Button, Modal } from '@/components';

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
    <Modal open={!!selectedMessageId} onOpenChange={onClose}>
      <section>ss</section>
      <footer className="mt-8 w-full">
        <Button
          className="w-full"
          color="red"
          onClick={() => {
            onClickDeleteModeButton?.(selectedMessageId!);
            onClose?.();
          }}
        >
          삭제
        </Button>
      </footer>
    </Modal>
  );
};

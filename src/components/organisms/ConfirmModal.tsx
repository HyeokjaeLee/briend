import { IoIosWarning } from 'react-icons/io';

import { Modal } from '../molecules/Modal';

export interface ConfirmModalProps {
  opened: boolean;
  onClose?: () => void;
  title: string;
  message: string;
  footer?: React.ReactNode;
  rootClassName?: string;
}

export const ConfirmModal = ({
  opened,
  onClose,
  title,
  message,
  footer,
  rootClassName,
}: ConfirmModalProps) => (
  <Modal
    hasCloseButton
    className="flex flex-col gap-4"
    open={opened}
    rootClassName={rootClassName}
    onClose={onClose}
  >
    <div className="rounded-full bg-zinc-100 p-5 flex-center">
      <IoIosWarning className="size-10 text-red-500" />
    </div>
    <strong className="text-center text-xl font-semibold">{title}</strong>
    <p className="mx-10 mb-8 text-center text-zinc-600">{message}</p>
    {footer}
  </Modal>
);

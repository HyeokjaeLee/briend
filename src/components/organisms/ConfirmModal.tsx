import { IoIosWarning } from 'react-icons/io';

import type { ModalProps } from '../molecules/Modal';
import { Modal } from '../molecules/Modal';

export interface ConfirmModalProps
  extends Pick<
    ModalProps,
    'open' | 'footer' | 'onOpenChange' | 'rootClassName' | 'className'
  > {
  title: string;
  message: string;
  footer?: React.ReactNode;
}

export const ConfirmModal = ({
  title,
  message,
  ...dialogProps
}: ConfirmModalProps) => (
  <Modal className="flex flex-col gap-4" {...dialogProps}>
    <div className="flex-center mx-auto size-fit rounded-full bg-zinc-100 p-5">
      <IoIosWarning className="size-8 text-red-500" />
    </div>
    <h2 className="text-center text-xl font-semibold" data-slot="dialog-title">
      {title}
    </h2>
    <p
      data-slot="dialog-description"
      className="text-primary/50 text-center text-sm"
    >
      {message}
    </p>
  </Modal>
);

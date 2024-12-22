import React from 'react';
import { toast as toastifyToast } from 'react-toastify';

import FailIcon from './_assets/fail.svg';
import InfoIcon from './_assets/info.svg';
import SuccessIcon from './_assets/success.svg';
import WarningIcon from './_assets/warning.svg';

export interface ToastOptions {
  type?: 'fail' | 'success' | 'warning' | 'info';
  message: string;
  holdTime?: number;
}

const toastQueue = new Set<string>();

export const toast = ({
  message,
  holdTime = 3_000,
  type = 'success',
}: ToastOptions) => {
  const Icon = {
    success: SuccessIcon,
    fail: FailIcon,
    warning: WarningIcon,
    info: InfoIcon,
  }[type];

  const messageId = message + type;

  if (toastQueue.has(messageId)) return;

  toastQueue.add(messageId);

  toastifyToast(message, {
    autoClose: holdTime,
    icon: (
      <div className="animate-jump-in animate-delay-75">
        <Icon />
      </div>
    ),
    onClose: () => {
      toastQueue.delete(messageId);
    },
  });
};

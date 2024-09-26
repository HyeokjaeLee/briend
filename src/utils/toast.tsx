import React from 'react';
import { toast as toastifyToast } from 'react-toastify';

import FailIcon from '@/assets/toast/fail.svg';
import InfoIcon from '@/assets/toast/info.svg';
import SuccessIcon from '@/assets/toast/success.svg';
import WarningIcon from '@/assets/toast/warning.svg';

export interface ToastOptions {
  type?: 'fail' | 'success' | 'warning' | 'info';
  message: string;
  holdTime?: number;
}

const toastQueue = new Set<string>();

export const toast = async ({
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

  setTimeout(() => {
    toastQueue.delete(messageId);
  }, holdTime);

  toastifyToast(message, {
    autoClose: holdTime,
    icon: <Icon className="size-5" />,
  });

  return new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
};

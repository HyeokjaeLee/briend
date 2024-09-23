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

  return toastifyToast(message, {
    autoClose: holdTime,
    icon: <Icon className="size-5" />,
  });
};

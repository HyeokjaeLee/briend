'use client';

import { useOnLogin } from './_hooks/useOnLogin';
import { useRefreshToast } from './_hooks/useRefreshToast';

export const ClientMountAction = () => {
  useRefreshToast();

  useOnLogin();

  return null;
};

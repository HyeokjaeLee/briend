'use client';

import { useOnSessionChanged } from './_hooks/useOnSessionChanged';
import { useRefreshToast } from './_hooks/useRefreshToast';

export const MountAction = () => {
  useRefreshToast();

  useOnSessionChanged();

  return null;
};

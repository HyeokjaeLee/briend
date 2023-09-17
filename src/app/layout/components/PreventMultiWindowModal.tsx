'use client';

import { LANGUAGE, LANGUAGE_PACK } from '@/constants';
import { Modal } from '@hyeokjaelee/pastime-ui';

import { useCheckMultiWindows } from '../hook/useCheckMultiWindows';

export const PreventMultiWindowModal = () => {
  const { isMultiWindows } = useCheckMultiWindows();

  return (
    <Modal opened={isMultiWindows}>
      <Modal.Header>
        {LANGUAGE_PACK.PREVENT_MULTI_CONNECTION_TITLE[LANGUAGE.KOREAN]}
      </Modal.Header>
    </Modal>
  );
};

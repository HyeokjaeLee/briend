'use client';

import { Lock } from 'react-feather';

import { LANGUAGE, LANGUAGE_PACK } from '@/constants';
import { Modal } from '@hyeokjaelee/pastime-ui';

import { useCheckMultiWindows } from '../hook/useCheckMultiWindows';

export const PreventMultiWindowModal = () => {
  const { isMultiWindows } = useCheckMultiWindows();

  return (
    <Modal opened={isMultiWindows} className="gap-16 p-8">
      <Modal.Header>
        <h2 className="text-2xl font-semibold">
          ✋ {LANGUAGE_PACK.PREVENT_MULTI_WINDOW_TITLE[LANGUAGE.KOREAN]}
        </h2>
      </Modal.Header>
      <section className="flex justify-center items-center flex-col gap-16">
        <Lock size="3rem" />
        <p className="font-semibold">
          {LANGUAGE_PACK.PREVENT_MULTI_WINDOW_DESCRIPTION[LANGUAGE.KOREAN]}
        </p>
      </section>
    </Modal>
  );
};

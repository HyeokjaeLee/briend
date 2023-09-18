'use client';

import { Lock } from 'react-feather';

import { LANGUAGE_PACK } from '@/constants';
import { useChattingRoomStore } from '@/store/useChattingRoomStore';
import { useGlobalStore } from '@/store/useGlobalStore';
import { Modal } from '@hyeokjaelee/pastime-ui';

import { useCheckMultiWindows } from '../hook/useCheckMultiWindows';

export const PreventMultiWindowModal = () => {
  const { isMultiWindows } = useCheckMultiWindows();

  const deviceLanguage = useGlobalStore((state) => state.deviceLanguage);

  const chattingRoom = useChattingRoomStore((state) => state.chattingRoom);
  const language = chattingRoom?.userLanguage ?? deviceLanguage;

  return (
    <Modal opened={isMultiWindows} className="gap-16 p-8">
      <Modal.Header>
        <h2 className="text-2xl font-bold">
          ✋ {LANGUAGE_PACK.PREVENT_MULTI_WINDOW_TITLE[language]}
        </h2>
      </Modal.Header>
      <section className="flex justify-center items-center flex-col gap-16">
        <Lock size="3rem" />
        <p className="font-semibold">
          {LANGUAGE_PACK.PREVENT_MULTI_WINDOW_DESCRIPTION[language]}
        </p>
      </section>
    </Modal>
  );
};

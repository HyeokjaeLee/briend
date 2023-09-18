'use client';

import { Lock } from 'react-feather';

import { LANGUAGE_PACK } from '@/constants';
import { useChattingRoomIndexDBStore } from '@/store/useChattingRoomIndexDBStore';
import { getDeviceLanguage } from '@/utils';
import { Modal } from '@hyeokjaelee/pastime-ui';

import { useCheckMultiWindows } from '../hook/useCheckMultiWindows';

export const PreventMultiWindowModal = () => {
  const { isMultiWindows } = useCheckMultiWindows();

  const chattingRoom = useChattingRoomIndexDBStore(
    (state) => state.chattingRoom,
  );
  const deviceLanguage = chattingRoom?.userLanguage ?? getDeviceLanguage();

  return (
    <Modal opened={isMultiWindows} className="gap-16 p-8">
      <Modal.Header>
        <h2 className="text-2xl font-bold">
          ✋ {LANGUAGE_PACK.PREVENT_MULTI_WINDOW_TITLE[deviceLanguage]}
        </h2>
      </Modal.Header>
      <section className="flex justify-center items-center flex-col gap-16">
        <Lock size="3rem" />
        <p className="font-semibold">
          {LANGUAGE_PACK.PREVENT_MULTI_WINDOW_DESCRIPTION[deviceLanguage]}
        </p>
      </section>
    </Modal>
  );
};

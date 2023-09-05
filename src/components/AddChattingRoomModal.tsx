'use client';

import { shallow } from 'zustand/shallow';

import { useEffect, useState } from 'react';

import { LANGUAGE } from '@/constants';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useChattingStore } from '@/hooks/useChattingStore';
import { useGetChattingRoomToken } from '@/hooks/useGetChattingRoomToken';
import { useLayoutStore } from '@/hooks/useLayoutStore';
import { chattingChannelName } from '@/utils';
import {
  Button,
  Modal,
  Selectbox,
  Textbox,
  useToast,
} from '@hyeokjaelee/pastime-ui';

import { QR } from './QR';

const OPTIONS = [
  {
    label: '🇺🇸 영어',
    value: LANGUAGE.ENGLISH,
  },
  {
    label: '🇯🇵 일본어',
    value: LANGUAGE.JAPANESE,
  },
];

export const AddChattingRoomModal = () => {
  const [opened, setOpened] = useLayoutStore(
    (state) => [
      state.addChattingRoomModalOpened,
      state.setAddChattingRoomModalOpened,
    ],
    shallow,
  );

  const [guestLanguage, setGuestLanguage] = useState(LANGUAGE.ENGLISH);
  const [hostId, hostName] = useAuthStore(
    (state) => [state.userId, state.userName],
    shallow,
  );
  const [guestName, setGuestName] = useState('새친구');
  const pusher = useChattingStore((state) => state.pusher);
  const { toast } = useToast();

  const { isLoading, token, getToken, resetToken } = useGetChattingRoomToken();

  const addChattingRoomToken = useChattingStore(
    (state) => state.addChattingRoomToken,
  );

  useEffect(() => {
    if (pusher && token && guestName && hostId && opened) {
      const chattingChannel = pusher.subscribe(
        chattingChannelName({
          guestName,
          hostId,
        }),
      );

      chattingChannel.bind('join-channel', (token: string) => {
        setOpened(false);
        resetToken();
        addChattingRoomToken(token);
        toast({
          message: `${guestName}님과 연결되었어요.`,
        });
      });

      return () => chattingChannel.unsubscribe();
    }
  }, [
    addChattingRoomToken,
    guestName,
    hostId,
    opened,
    pusher,
    resetToken,
    setOpened,
    toast,
    token,
  ]);

  const [guestTitle, guestDescription] = (() => {
    switch (guestLanguage) {
      case LANGUAGE.ENGLISH:
        return ['Invite to chat', 'Scan the QR code to chat in English.'];
      case LANGUAGE.JAPANESE:
        return ['チャット招待', 'QRコードをスキャンして日本語でチャットする。'];

      default:
        throw new Error('Guest의 언어가 올바르지 않습니다.');
    }
  })();

  return (
    <Modal
      zIndex={200}
      opened={opened}
      onClose={() => {
        setOpened(false);
        resetToken();
      }}
      className="w-full max-w-xl m-2"
    >
      <Modal.Header closeButton />
      <section className="p-3 flex flex-col items-center">
        <h1 className="font-bold text-3xl text-left mb-16">
          {token ? guestTitle : '친구 초대'}
        </h1>
        {token ? (
          <>
            <QR
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/guest/chat?token=${token}`}
              alt="guest-qr"
              size={350}
            />
            <p className="font-bold text-lg my-9">{guestDescription}</p>
          </>
        ) : (
          <form
            className="flex flex-col gap-8 w-full"
            onSubmit={async (e) => {
              e.preventDefault();

              if (hostId && hostName) {
                getToken({
                  hostId,
                  hostName,
                  guestName,
                  guestLanguage,
                });
              }
            }}
          >
            <Selectbox
              label="상대방 언어"
              size="large"
              className="w-full"
              value={guestLanguage}
              cancelable={false}
              onChange={(e) => {
                e.preventInnerStateChange();
                setGuestLanguage(e.value);
              }}
              options={OPTIONS}
            />
            <Textbox
              label="상대방 이름"
              placeholder="상대방이 사용할 이름"
              className="w-full"
              size="large"
              value={guestName}
              onChange={(e) => {
                e.preventInnerStateChange();
                setGuestName(e.value);
              }}
              validation={(value) => {
                if (!value) return '이름을 입력해주세요';

                if (value.length > 3) return '이름은 3글자 이내로 입력해주세요';
              }}
              required
            />
            <Button
              size="large"
              className="w-full font-bold"
              type="submit"
              loading={isLoading}
            >
              QR 코드 생성
            </Button>
          </form>
        )}
      </section>
    </Modal>
  );
};

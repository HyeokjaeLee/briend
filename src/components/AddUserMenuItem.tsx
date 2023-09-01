'use client';

import axios from 'axios';

import { useState } from 'react';
import { flushSync } from 'react-dom';
import { UserPlus } from 'react-feather';

import { LANGUAGE } from '@/constants';
import { useGetGuestToken } from '@/hooks';
import { useAuthStore } from '@/store/authStore';
import { Button, Modal, Selectbox, Textbox } from '@hyeokjaelee/pastime-ui';

import { MenuItem } from './MenuItem';
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

export const AddUserMenuItem = () => {
  const [opened, setOpened] = useState(false);
  const [guestLanguage, setGuestLanguage] = useState(LANGUAGE.ENGLISH);
  const hostId = useAuthStore((state) => state.id);
  const [guestName, setGuestName] = useState('새친구');

  const { isLoading, token, getGuestToken, resetToken } = useGetGuestToken();

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
    <>
      <MenuItem onClick={() => setOpened(true)}>
        <UserPlus className="ml-1" /> 초대 링크 생성
      </MenuItem>
      <Modal
        zIndex={200}
        opened={opened}
        onClose={() => {
          setOpened(false);
          resetToken();
        }}
        className="w-full max-w-2xl m-2"
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
              />{' '}
              <p className="font-bold text-lg mt-2">{guestDescription}</p>
            </>
          ) : (
            <form
              className="flex flex-col gap-8 w-full"
              onSubmit={async (e) => {
                e.preventDefault();

                if (hostId) {
                  getGuestToken({
                    hostId,
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

                  if (value.length > 3)
                    return '이름은 3글자 이내로 입력해주세요';
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
    </>
  );
};

'use client';

import { useState } from 'react';
import { UserPlus } from 'react-feather';

import { LANGUAGE } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { Modal, Selectbox, Textbox } from '@hyeokjaelee/pastime-ui';

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
  const [language, setLanguage] = useState(LANGUAGE.ENGLISH);
  const id = useAuthStore((state) => state.id);
  const [userName, setUserName] = useState('새친구');

  return (
    <>
      <MenuItem onClick={() => setOpened(true)}>
        <UserPlus className="ml-1" /> 초대 링크 생성
      </MenuItem>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        className="w-full max-w-2xl m-2"
      >
        <Modal.Header closeButton />
        <section className="p-3 flex flex-col items-center">
          <div className="flex flex-col gap-8 mb-5 w-full">
            <Selectbox
              label="상대방 언어"
              size="large"
              className="w-full"
              value={language}
              cancelable={false}
              onChange={(e) => {
                e.preventInnerStateChange();
                setLanguage(e.value);
              }}
              options={OPTIONS}
            />
            <Textbox
              label="상대방 이름"
              placeholder="상대방이 사용할 이름"
              className="w-full"
              size="large"
              value={userName}
              onChange={(e) => {
                e.preventInnerStateChange();
                setUserName(e.value);
              }}
              validation={(value) => {
                if (!value) return '이름을 입력해주세요';

                if (value.length > 3) return '이름은 3글자 이내로 입력해주세요';
              }}
              required
            />
          </div>
          <QR
            src={`'${process.env.NEXT_PUBLIC_BASE_URL}/guest/chat?id=${id}&lang=${language}&user=${userName}'`}
            alt="add-user-qr"
            size={350}
          />
          <p className="font-bold text-lg mt-2">
            {(() => {
              switch (language) {
                case LANGUAGE.ENGLISH:
                  return 'Scan the QR code to chat in English.';
                case LANGUAGE.JAPANESE:
                  return 'QRコードをスキャンして日本語でチャットする。';
              }
            })()}
          </p>
        </section>
      </Modal>
    </>
  );
};

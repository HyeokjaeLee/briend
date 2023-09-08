'use client';

import { shallow } from 'zustand/shallow';

import { useRouter } from 'next/navigation';
import { Link } from 'react-feather';

import { LANGUAGE } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Button,
  Selectbox,
  Textbox,
  useToast,
  useValidate,
  validationObserver,
} from '@hyeokjaelee/pastime-ui';

import { useGetChattingRoomToken } from './hooks/useGetChattingRoomToken';

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

const InvitePage = validationObserver(() => {
  const [hostId, hostName, chattingRoomMap] = useAuthStore(
    (state) => [state.userId, state.userName, state.chattingRoomMap],
    shallow,
  );

  const { isLoading, getToken } = useGetChattingRoomToken();

  const inputValues = {
    guestLanguage: LANGUAGE.ENGLISH,
    guestName: '',
  };

  const router = useRouter();

  const { toast } = useToast();

  const { validate } = useValidate();

  return (
    <main className="flex flex-col items-center max-w-3xl justify-center mx-auto my-16 p-page">
      <h1 className="font-bold text-3xl text-left w-full mb-12">
        👋 새로운 친구 초대
      </h1>
      <form
        className="flex flex-col gap-8 w-full flex-1"
        onInvalid={() => {
          const { isValid } = validate();
          if (!isValid) {
            toast({
              message: '입력값을 확인해주세요',
              type: 'fail',
            });
          }
        }}
        onSubmit={async (e) => {
          e.preventDefault();
          if (hostId && hostName) {
            const token = await getToken({
              ...inputValues,
              hostId,
              hostName,
            });

            router.push(`invite/${token}`);
          }
        }}
      >
        <div className="flex flex-col gap-8">
          <Selectbox
            id="language"
            label="상대방 언어"
            size="large"
            className="w-full"
            required
            options={OPTIONS}
            value={inputValues.guestLanguage}
            onChange={({ value }) => {
              inputValues.guestLanguage = value;
            }}
          />
          <Textbox
            id="name"
            label="상대방 이름"
            placeholder="상대방이 사용할 이름"
            className="w-full"
            size="large"
            required
            value={inputValues.guestName}
            onChange={({ value }) => {
              inputValues.guestName = value;
            }}
            validation={(value) => {
              if (!value) return '이름을 입력해주세요';

              const isUniq =
                [...chattingRoomMap.values()].findIndex(
                  ({ guestName }) => guestName === value,
                ) === -1;

              if (!isUniq) return '이미 존재하는 이름입니다';

              if (value.length > 10) return '이름은 10자 이하여야 합니다';
            }}
          />
          <p>생성된 QR코드를 스캔하면 친구와 대화할 수 있어요</p>
        </div>
        <Button
          loading={isLoading}
          size="large"
          className="w-full font-bold"
          type="submit"
          icon={<Link />}
        >
          QR 코드 생성
        </Button>
      </form>
    </main>
  );
});

export default InvitePage;

import { shallow } from 'zustand/shallow';

import { useRouter } from 'next/navigation';
import { Link } from 'react-feather';

import { LANGUAGE } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useChattingDataStore } from '@/store/useChattingDataStore';
import {
  Button,
  Selectbox,
  Textbox,
  useToast,
  useValidate,
  validationObserver,
} from '@hyeokjaelee/pastime-ui';

import { useGetChattingRoomToken } from '../hooks/useGetChattingRoomToken';

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

export const InviteForm = validationObserver(() => {
  const [hostId, hostName] = useAuthStore(
    (state) => [state.userId, state.userName],
    shallow,
  );

  const chattingRoomList = useChattingDataStore(
    (state) => state.chattingRoomList,
  );

  const { getChattingRoomToken, isLoading } = useGetChattingRoomToken();

  const inputValues = {
    guestLanguage: LANGUAGE.ENGLISH,
    guestName: '',
  };

  const router = useRouter();

  const { toast } = useToast();

  const { validate } = useValidate();
  return (
    <form
      className="flex flex-col gap-8 w-full flex-1"
      onInvalid={() => {
        const { isValid } = validate();
        if (!isValid) {
          toast({
            message: '입력하지 않은 항목이 있어요!',
            type: 'fail',
          });
        }
      }}
      onSubmit={async (e) => {
        e.preventDefault();
        const { isValid } = validate();
        if (hostId && hostName && isValid) {
          const token = await getChattingRoomToken({
            ...inputValues,
            hostId,
            hostName,
          });

          router.push(`invite/${token}`);
        } else {
          toast({
            message: '상대방 이름을 다시 확인해 주세요!',
            type: 'fail',
          });
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

            const isAlredyExist = !!chattingRoomList?.some(
              (chattingRoom) => chattingRoom.opponentName === value,
            );

            if (value === hostName)
              return '초대하는 사람의 이름과 같을 수 없어요!';

            if (isAlredyExist) return '이미 사용중인 친구 이름이에요!';

            if (value.length > 10) return '이름은 10자 이하여야 합니다';
          }}
        />
        <p>생성된 QR코드를 스캔하면 친구와 대화할 수 있어요</p>
      </div>
      <Button
        loading={isLoading}
        className="w-full font-bold"
        type="submit"
        size="large"
        icon={<Link size="1rem" />}
      >
        QR 코드 생성
      </Button>
    </form>
  );
});

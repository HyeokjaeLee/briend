'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CheckCircle } from 'react-feather';

import Kakao from '@/assets/kakao.png';
import { KAKAO } from '@/constants';
import { useLogin, useSaveLoginInfoState } from '@/hooks';
import {
  Button,
  Switch,
  Textbox,
  useValidate,
  validationObserver,
} from '@hyeokjaelee/pastime-ui';

export const LoginForm = validationObserver(() => {
  const { isIdReady, login } = useLogin();

  const [isSaveInfo, setIsSaveInfo] = useSaveLoginInfoState();

  const [userName, setUserName] = useState('');

  const { validate } = useValidate();

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();

        const { isValid } = validate({
          scroll: false,
        });

        if (isValid) login({ userName, isSaveInfo });
      }}
    >
      <label className="text-xs flex w-fit items-center gap-2">
        로그인 정보 저장
        <Switch
          value={isSaveInfo}
          onChange={(e) => {
            e.preventInnerStateChange();
            setIsSaveInfo(e.value);
          }}
        />
      </label>
      <Button
        size="large"
        onClick={() => {
          window.location.href = KAKAO.SIGNIN_URL;
        }}
        theme={isIdReady ? 'unset' : 'secondary'}
        icon={
          isIdReady ? (
            <CheckCircle />
          ) : (
            <Image src={Kakao} alt="kakao-login" className="h-6 w-6" />
          )
        }
        className={`font-bold w-full ${
          isIdReady ? 'bg-slate-300 text-white' : ''
        }`}
        disabled={isIdReady}
      >
        {isIdReady ? '인증 완료' : '카카오 인증'}
      </Button>
      <Textbox
        id="name"
        size="large"
        className="w-full"
        label="이름"
        placeholder={
          isIdReady ? '상대방에게 표시할 이름' : '카카오 인증이 필요합니다.'
        }
        fixedDarkMode="light"
        required
        value={userName}
        onChange={(e) => {
          e.preventInnerStateChange();
          const { value } = e;
          if (value.length < 4) setUserName(value);
        }}
        validation={(value) => {
          if (!value) return '이름을 입력해주세요.';
          if (value.length > 3) return '3글자 이하로 입력해주세요.';
        }}
        disabled={!isIdReady}
      />
      <Button size="large" disabled={!isIdReady} type="submit">
        로그인
      </Button>
    </form>
  );
});

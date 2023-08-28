'use client';

import React, { useState } from 'react';

import { Button, Textbox } from '@hyeokjaelee/pastime-ui';

import { useLogin } from './_hooks/useLogin';

const Auth = () => {
  const [name, setName] = useState('');
  const { isSetting, login } = useLogin();

  return (
    <main>
      <Textbox
        disabled={isSetting}
        label="이름"
        placeholder="상대방에게 표시할 이름"
        value={name}
        onChange={(e) => {
          e.preventInnerStateChange();
          setName(e.value);
        }}
        required
        validation={(value) => {
          if (!value) return '이름을 입력해주세요.';
        }}
      />
      <Button disabled={isSetting} onClick={() => login(name)}>
        이름 설정
      </Button>
    </main>
  );
};

export default Auth;

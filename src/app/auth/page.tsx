'use client';

import React, { useState } from 'react';

import { useLogin } from '@/hooks';
import { Button, Textbox, useToast } from '@hyeokjaelee/pastime-ui';

const Auth = () => {
  const [name, setName] = useState('');
  const { isSetting, login } = useLogin();
  const { toast } = useToast();

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
      <Button
        disabled={isSetting}
        onClick={() => {
          const isSuccessful = login(name);
          if (isSuccessful) {
            toast({
              message: '로그인 되었습니다.',
            });
          } else {
            toast({
              message: '이름을 입력해주세요.',
            });
          }
        }}
      >
        이름 설정
      </Button>
    </main>
  );
};

export default Auth;

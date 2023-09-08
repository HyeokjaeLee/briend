'use client';

import { shallow } from 'zustand/shallow';

import { useAuthStore } from '@/store/useAuthStore';
import { Switch } from '@hyeokjaelee/pastime-ui';

export const SaveLogInSwitch = () => {
  const [isSaveLogIn, setIsSaveLogIn] = useAuthStore(
    (state) => [state.isSaveLogIn, state.setIsSaveLogIn],
    shallow,
  );

  return (
    <label className="text-xs flex w-fit items-center gap-2">
      로그인 정보 저장
      <Switch
        value={isSaveLogIn}
        onChange={(e) => {
          e.preventInnerStateChange();
          setIsSaveLogIn(e.value);
        }}
      />
    </label>
  );
};

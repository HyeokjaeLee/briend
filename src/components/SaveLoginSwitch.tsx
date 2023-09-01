'use client';

import { shallow } from 'zustand/shallow';

import { useAuthStore } from '@/hooks';
import { Switch } from '@hyeokjaelee/pastime-ui';

export const SaveLoginSwitch = () => {
  const [isSaveLogin, setIsSaveLogin] = useAuthStore(
    (state) => [state.isSaveLogin, state.setIsSaveLogin],
    shallow,
  );

  return (
    <label className="text-xs flex w-fit items-center gap-2">
      로그인 정보 저장
      <Switch
        value={isSaveLogin}
        onChange={(e) => {
          e.preventInnerStateChange();
          setIsSaveLogin(e.value);
        }}
      />
    </label>
  );
};

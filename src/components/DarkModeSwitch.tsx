'use client';

import { Sun, Moon } from 'react-feather';

import { LOCAL_STORAGE } from '@/constants';
import { Switch, useDarkMode } from '@hyeokjaelee/pastime-ui';

export const DarkModeSwitch = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <Switch
      size="large"
      value={isDarkMode}
      onChange={({ value }) => {
        if (value) {
          document.documentElement.classList.add('dark');
          localStorage.setItem(LOCAL_STORAGE.DARK_MODE, 'true');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem(LOCAL_STORAGE.DARK_MODE, 'false');
        }
      }}
    >
      {isDarkMode ? (
        <Moon className="text-black" size="1em" />
      ) : (
        <Sun className="text-black" size="1em" />
      )}
    </Switch>
  );
};

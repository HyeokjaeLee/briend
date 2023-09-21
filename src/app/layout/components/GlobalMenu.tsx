'use client';

import { shallow } from 'zustand/shallow';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { UserPlus, Users } from 'react-feather';

import { LANGUAGE_PACK } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useGlobalStore } from '@/store/useGlobalStore';
import { Drawer } from '@hyeokjaelee/pastime-ui';

import { DarkModeSwitch } from './DarkModeSwitch';
import { KakaoAuthButton } from './KakaoAuthButton';
import { MenuItem } from './MenuItem';

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *

 */
interface BeforeInstallPromptEvent extends Event {
  /**
   * Returns an array of DOMString items containing the platforms on which the event was dispatched.
   * This is provided for user agents that want to present a choice of versions to the user such as,
   * for example, "web" or "play" which would allow the user to chose between a web version or
   * an Android version.
   */
  readonly platforms: Array<string>;

  /**
   * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
   */
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;

  /**
   * Allows a developer to show the install prompt at a time of their own choosing.
   * This method returns a Promise.
   */
  prompt(): Promise<void>;
}

export const GlobalMenu = () => {
  const [opened, setOpened, deviceLanguage] = useGlobalStore(
    (state) => [
      state.globalMenuOpened,
      state.setGlobalMenuOpened,
      state.deviceLanguage,
    ],
    shallow,
  );

  const isLogin = useAuthStore((state) => state.isLogin);

  const router = useRouter();

  const iconClassName = 'ml-1 w-5 h-5';

  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const { current: btnAdd } = ref;
    let deferredPrompt: BeforeInstallPromptEvent | null = null;

    if (btnAdd) {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e as BeforeInstallPromptEvent;
      });

      // Installation must be done by a user gesture! Here, the button click
      btnAdd.addEventListener('click', async () => {
        // hide our user interface that shows our A2HS button
        btnAdd.style.display = 'none';
        // Show the prompt
        deferredPrompt?.prompt();
        // Wait for the user to respond to the prompt
        try {
          const choiceResult = await deferredPrompt?.userChoice;
          if (choiceResult?.outcome === 'accepted')
            console.log('User accepted the A2HS prompt');
          else console.log('User dismissed the A2HS prompt');

          deferredPrompt = null;
          return null;
        } catch (err) {
          console.error(err);
        }
      });
    }
  }, []);

  return (
    <Drawer opened={opened} onClose={() => setOpened(false)}>
      <Drawer.Header closeButton />
      <div className="flex flex-col justify-between h-full">
        <ul className="flex flex-col gap-2">
          <MenuItem
            onClick={() => {
              setOpened(false);
              router.push('/chat/history');
            }}
          >
            <Users className={iconClassName} />{' '}
            {LANGUAGE_PACK.CHATTING_HISTORY[deviceLanguage]}
          </MenuItem>
          <MenuItem
            disabled={!isLogin}
            onClick={() => {
              setOpened(false);
              router.push('/invite');
            }}
          >
            <UserPlus className={iconClassName} />{' '}
            {LANGUAGE_PACK.CREATE_CHATTING_ROOM[deviceLanguage]}
          </MenuItem>
          <li>
            <button ref={ref}>다운로드</button>
          </li>
        </ul>
        <div className="flex w-full flex-col gap-4">
          <DarkModeSwitch />
          <KakaoAuthButton />
        </div>
      </div>
    </Drawer>
  );
};

/**
 * const GlobalMenu = () => {
  const [opened, setOpened] = useState(false);
  const deviceLanguage = useDeviceLanguage();

  const isLogin = useAuthStore((state) => state.isLogin);

  const router = useRouter();

  const iconClassName = 'ml-1 w-5 h-5';

  const handleInstallClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.deferredPrompt.prompt();
  };

  const handleInstallPrompt = (e: any) => {
    e.preventDefault();
    window.deferredPrompt = e;
    setOpened(true);
  };

  window.addEventListener('beforeinstallprompt', handleInstallPrompt);

  return (
    <Drawer opened={opened} onClose={() => setOpened(false)}>
      <Drawer.Header closeButton />
      <div className="flex flex-col justify-between h-full">
        <ul className="flex flex-col gap-2">
          <MenuItem
            onClick={() => {
              setOpened(false);
              router.push('/chat/history');
            }}
          >
            <Users className={iconClassName} />{' '}
            {LANGUAGE_PACK.CHATTING_HISTORY[deviceLanguage]}
          </MenuItem>
          <MenuItem
            disabled={!isLogin}
            onClick={() => {
              setOpened(false);
              router.push('/invite');
            }}
          >
            <UserPlus className={iconClassName} />{' '}
            {LANGUAGE_PACK.CREATE_CHATTING_ROOM[deviceLanguage]}
          </MenuItem>
        </ul>
        <div className="flex w-full flex-col gap-4">
          <DarkModeSwitch />
          <KakaoAuthButton />
          {window.deferredPrompt && (
            <button onClick={handleInstallClick}>
              {LANGUAGE_PACK.INSTALL_APP[deviceLanguage]}
            </button>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default GlobalMenu;

 */

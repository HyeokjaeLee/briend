import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { random as randomEmoji } from 'node-emoji';
import { shallow } from 'zustand/shallow';

import { useLayoutEffect } from 'react';

import type { LANGUAGE } from '@/constants/language';
import { LOCAL } from '@/constants/storage-key';
import { useProfileStore } from '@/stores/profile';

export const ProfileMounter = () => {
  const [setNickname, setEmoji, setIsLogin] = useProfileStore(
    (state) => [state.setNickname, state.setEmoji, state.setIsLogin],
    shallow,
  );

  const { lng } = useParams<{ lng: LANGUAGE }>();

  const { data: session } = useSession();

  useLayoutEffect(() => {
    if (!session) return setIsLogin(false);

    setNickname((prevNickname) => {
      if (prevNickname) return prevNickname;

      return (
        localStorage.getItem(LOCAL.MY_NICKNAME) ||
        session.user?.name?.slice(0, 20) ||
        `${lng}-friend`
      );
    });

    setEmoji((prevEmoji) => {
      if (prevEmoji) return prevEmoji;

      return (
        localStorage.getItem(LOCAL.MY_PROFILE_EMOJI) || randomEmoji().emoji
      );
    });

    return setIsLogin(true);
  }, [session, lng, setEmoji, setIsLogin, setNickname]);

  return null;
};

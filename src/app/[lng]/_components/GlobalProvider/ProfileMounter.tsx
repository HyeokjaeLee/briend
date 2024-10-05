import { decodeJwt } from 'jose';
import { useParams } from 'next/navigation';
import { random as randomEmoji } from 'node-emoji';
import { shallow } from 'zustand/shallow';

import { useLayoutEffect } from 'react';
import { useCookies } from 'react-cookie';

import { COOKIES } from '@/constants/cookies-key';
import type { LANGUAGE } from '@/constants/language';
import { LOCAL } from '@/constants/storage-key';
import { useProfileStore } from '@/stores/profile';
import type { Payload } from '@/types/jwt';

export const ProfileMounter = () => {
  const [setNickname, setEmoji, setIsLogin] = useProfileStore(
    (state) => [state.setNickname, state.setEmoji, state.setIsLogin],
    shallow,
  );

  const { lng } = useParams<{ lng: LANGUAGE }>();

  const [cookies] = useCookies([COOKIES.ACCESS_TOKEN]);

  const accessToken: string | undefined = cookies[COOKIES.ACCESS_TOKEN];

  useLayoutEffect(() => {
    if (!accessToken) return setIsLogin(false);

    const payload = decodeJwt<Payload.AccessToken>(accessToken);

    setNickname((prevNickname) => {
      if (prevNickname) return prevNickname;

      return (
        localStorage.getItem(LOCAL.MY_NICKNAME) ||
        payload.name.slice(0, 20) ||
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
  }, [accessToken, lng, setEmoji, setIsLogin, setNickname]);

  return null;
};

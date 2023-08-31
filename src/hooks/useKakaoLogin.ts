import axios from 'axios';
import { shallow } from 'zustand/shallow';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuthStore } from './useAuthStore';

interface KakaoAccessTokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
  token_type: string;
}

interface KaKaoUserResponse {
  connected_at: string;
  id: number;
  kakao_account: {
    profile: {
      nickname?: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
      is_default_image: boolean;
    };
    profile_image_needs_agreement: boolean;
    profile_nickname_needs_agreement: boolean;
  };
}

export const useKakaoLogin = () => {
  const [setUserId, setUserName, setProfileImage] = useAuthStore(
    (state) => [state.setUserId, state.setUserName, state.setProfileImage],
    shallow,
  );

  const code = useSearchParams()?.get('code');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cleanUp = () => {
      setIsLoading(false);
      router.replace('/');
    };

    try {
      if (code) {
        setIsLoading(true);

        (async () => {
          const kakaoAccessTokenResponse =
            await axios.post<KakaoAccessTokenResponse>(
              'https://kauth.kakao.com/oauth/token',
              {
                grant_type: 'authorization_code',
                client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
                redirect_uri: process.env.NEXT_PUBLIC_BASE_URL,
                code,
              },
              {
                headers: {
                  'Content-Type':
                    'application/x-www-form-urlencoded;charset=utf-8',
                },
              },
            );

          const accessToken = kakaoAccessTokenResponse.data.access_token;

          if (accessToken) {
            const { data } = await axios.get<KaKaoUserResponse>(
              'https://kapi.kakao.com/v2/user/me',
              {
                params: {
                  access_token: accessToken,
                },
              },
            );

            const { id, kakao_account: account } = data;

            if (id) {
              setUserId(String(id));

              setUserName(account.profile.nickname ?? null);

              setProfileImage(account.profile.profile_image_url ?? null);

              cleanUp();
            }
          }
        })();
      }
    } catch (e) {
      cleanUp();
    }
  }, [code, setProfileImage, setUserId, setUserName, router]);

  return {
    isLoading,
    kakaoLogin: () => {
      window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}&response_type=code`;
    },
  };
};

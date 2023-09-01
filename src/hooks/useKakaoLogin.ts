import axios from 'axios';
import { shallow } from 'zustand/shallow';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useToast } from '@hyeokjaelee/pastime-ui';

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
    (state) => [
      state.setUserId,
      state.setUserName,
      state.setProfileImage,
      state.isSaveLogin,
    ],
    shallow,
  );
  const searchParams = useSearchParams();
  const code = searchParams?.get('code');
  const isLogout = searchParams?.get('logout');

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
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

          if (kakaoAccessTokenResponse) {
            router.replace('/');

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
                const userId = String(id);
                const userName = account.profile.nickname ?? null;
                const profileImage = account.profile.profile_image_url ?? null;

                setUserId(userId);

                setUserName(userName);

                setProfileImage(profileImage);
              }
            }

            setIsLoading(false);
            toast({
              message: '로그인 되었습니다.',
            });
          }
        })();
      }
    } catch (e) {
      toast({
        message: '로그인에 실패했습니다.',
        type: 'fail',
      });
      setIsLoading(false);
    }
  }, [code, setProfileImage, setUserId, setUserName, router, toast]);

  useEffect(() => {
    if (isLogout) {
      setUserId(null);
      setUserName(null);
      setProfileImage(null);
      router.replace('/');
      toast({
        message: '로그아웃 되었습니다.',
      });
    }
  }, [isLogout, router, setProfileImage, setUserId, setUserName, toast]);

  return {
    isLoading,
    kakaoLogin: () => {
      window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}&response_type=code`;
    },
  };
};

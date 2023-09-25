import axios from 'axios';
import { shallow } from 'zustand/shallow';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PATH } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { KaKaoUserResponse, KakaoAccessTokenResponse } from '@/types';
import { useToast } from '@hyeokjaelee/pastime-ui';

export const useKakaoLogIn = () => {
  const [setUserId, setUserName] = useAuthStore(
    (state) => [state.setUserId, state.setUserName],
    shallow,
  );

  const searchParams = useSearchParams();
  const code = searchParams?.get('code');

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}${PATH.AUTH}`;

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
                redirect_uri: redirectUri,
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

                setUserId(userId);

                setUserName(userName);
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
  }, [code, redirectUri, setUserId, setUserName, toast]);

  return {
    code,
    isLoading,
    kakaoLogIn: () => {
      window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${redirectUri}&response_type=code`;
    },
  };
};

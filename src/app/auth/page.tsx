'use client';

import Image from 'next/image';

import { BackgroundImage } from '@/components/BackgroundImage';
import { useGuestUserOnly } from '@/hooks/useGuestUserOnly';
import { useAuthStore } from '@/store/useAuthStore';
import Logo from '@assets/resources/logo.svg';

import { KakaoLogInButton } from './components/KakaoLogInButton';
import { SaveLogInSwitch } from './components/SaveLogInSwitch';
import { useKakaoLogIn } from './hooks/useKakaoLogIn';
import { useKakaoLogOut } from './hooks/useKakaoLogOut';

const AuthPage = () => {
  const { isLogOut } = useKakaoLogOut();
  const isBinded = useAuthStore((state) => state.isBinded);

  const { isLoading, kakaoLogIn, code } = useKakaoLogIn();
  useGuestUserOnly();

  return isLogOut || !isBinded ? null : (
    <article className="h-full">
      <BackgroundImage />
      {code ? null : (
        <section className="h-full flex items-center justify-center animate-fade-in">
          <div className="max-w-page flex-col flex bg-slate-50 w-full h-fit box-border rounded-md p-4 m-5 text-zinc-800">
            <div className="flex flex-col w-fit items-center m-auto py-28">
              <h1 className="flex font-bold text-4xl items-center gap-2">
                <Image src={Logo} alt="briend" className="w-10" />
                Be friend
              </h1>
              <h2 className="text-[12px] font-normal">
                언어의 장벽없는 새로운 사람과의 대화
              </h2>
            </div>
            <form className="flex flex-col gap-3">
              <SaveLogInSwitch />
              <KakaoLogInButton onClick={kakaoLogIn} isLoading={isLoading} />
            </form>
          </div>
        </section>
      )}
    </article>
  );
};

export default AuthPage;

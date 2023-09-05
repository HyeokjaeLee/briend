import Image from 'next/image';

import Background from '@/assets/Background.jpeg';
import Logo from '@/assets/Logo.svg';
import { KakaoLoginButton } from '@/components/KakaoLoginButton';
import { SaveLoginSwitch } from '@/components/SaveLoginSwitch';

const HomePage = () => (
  <main className="w-full">
    <article className="h-page relative flex flex-col">
      <div className="absolute z-[-1] h-page w-full">
        <Image src={Background} alt="tokyo" layout="fill" objectFit="cover" />
        <div className="w-full h-full bg-black opacity-90 absolute" />
      </div>
      <section className="flex-1 flex items-center justify-center">
        <div className="min-w-iPhoneSE max-w-lg w-full flex-col flex bg-slate-50 h-fit box-border rounded-md p-5 m-5">
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
            <SaveLoginSwitch />
            <KakaoLoginButton />
          </form>
        </div>
      </section>
    </article>
  </main>
);

export default HomePage;

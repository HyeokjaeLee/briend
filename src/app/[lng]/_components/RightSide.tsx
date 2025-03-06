import Image from 'next/image';

import { Button, DotLottie } from '@/components';

export const RightSide = () => {
  return (
    <aside className="hidden h-dvh flex-1 flex-col overflow-auto xl:flex">
      <div className="flex-center flex-1 flex-col gap-2">
        <DotLottie src="/assets/lottie/translate.lottie" className="size-100" />
        <div className="container px-4 text-center">
          <h2 className="mb-6 text-2xl font-bold tracking-tighter sm:text-3xl">
            지금 바로 시작하세요
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-[600px]">
            BRIEND로 언어의 경계를 넘어 전 세계와 자유롭게 소통하세요.
            <br />
            지금 다운로드하고 무료로 시작해보세요.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button className="gap-2">
              <Image
                src="/assets/login/apple.png"
                width={30}
                height={30}
                alt="Google Play"
              />
              App Store
            </Button>
            <Button variant="outline" className="gap-2">
              <Image
                src="/assets/login/google.png"
                width={30}
                height={30}
                alt="Google Play"
              />
              Google Play
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

import Image from 'next/image';
import Link from 'next/link';
import { LuGlobe } from 'react-icons/lu';

import { Button, DotLottie } from '@/components';

export const RightSide = () => {
  return (
    <aside className="hidden h-dvh flex-1 flex-col xl:flex">
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
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="flex items-center gap-2">
            <LuGlobe className="text-primary h-5 w-5" />
            <span className="font-bold">BRIEND</span>
          </div>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              개인정보처리방침
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              이용약관
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              고객지원
            </Link>
          </div>
          <div className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} BRIEND. All rights reserved.
          </div>
        </div>
      </footer>
    </aside>
  );
};

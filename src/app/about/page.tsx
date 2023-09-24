import Image from 'next/image';

import TurtleMagic from '@assets/resources/turtle-magic.png';

const AboutPage = () => (
  <article className="max-w-3xl flex flex-col gap-6 text-lg justify-center mx-auto my-24 px-8">
    <h1 className="text-4xl mb-8 flex justify-center items-center flex-col">
      <Image
        className="w-28 h-28 animate-bounce"
        src={TurtleMagic}
        alt="about"
        priority
      />
      About
    </h1>
    <section>
      <h2 className="text-2xl mb-2">🇰🇷 Korean</h2>
      <p>
        여행다니면서 친구사귀는걸 좋아해서 만들게 되었어요!
        <br />
        간단한 스캔으로 상대방과의 대화를 번역해드리는 앱이에요!
      </p>
      <p>
        PWA를 지원하고 있어서 브라우저에서 홈화면에 추가 하면 앱처럼 사용할 수
        있어요.
      </p>
    </section>
    <section>
      <h2 className="text-2xl mb-2">🌏 English</h2>
      <p>
        I made this app because I love making friends while traveling!
        <br />
        This app will translate your conversation with the other person with a
        simple scan!
      </p>
      <p>
        It supports PWA, so you can add it to your home screen in your browser
        and use it like an app.
      </p>
    </section>
    <footer className="pt-5 border-t-2">
      It was created by Hyeokjae Lee and all source code is available on{' '}
      <a
        href="https://github.com/HyeokjaeLee/briend"
        target="_blank"
        className="text-blue-400"
      >
        GitHub
      </a>
      !
    </footer>
  </article>
);

export default AboutPage;

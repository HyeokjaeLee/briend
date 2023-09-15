import { BackgroundImage } from './components/BackgroundImage';
import { DescriptionSection } from './components/DescriptionSection';
import { LogInButton } from './components/LogInButton';

const HomePage = () => (
  <main className="h-page relative flex items-center justify-center flex-col gap-2">
    <BackgroundImage />
    <DescriptionSection />
    <LogInButton />
    <section className="absolute bottom-0 left-0 text-slate-200 p-5 flex flex-col gap-3">
      <h1 className="flex font-semibold text-8xl items-center gap-2 leading-[0.8]">
        Be
        <br />
        friend
      </h1>
      <h2 className="text-base font-normal px-2">
        언어의 장벽없는 새로운 사람과의 대화
      </h2>
    </section>
  </main>
);

export default HomePage;

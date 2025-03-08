import { Logo } from '@/components';
import { InstallPWAButton } from '@/components/InstallPWAButton';

export default function Home() {
  return (
    <section className="size-full">
      <div className="size-100 flex-center bg-primary rounded-[100px] p-8">
        <Logo className="text-white" />
      </div>
      <InstallPWAButton />
    </section>
  );
}

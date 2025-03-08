import { Logo } from '@/components';
import { InstallPWAButton } from '@/components/InstallPWAButton';

export default function Home() {
  return (
    <section className="size-full">
      <div className="flex-center bg-primary size-[512px] rounded-[77px] p-8">
        <Logo className="text-white" />
      </div>
      <InstallPWAButton />
    </section>
  );
}

import { LuGlobe } from 'react-icons/lu';

import { Logo } from '@/components';
import { LANGUAGE_NAME } from '@/constants';
import { useLanguage } from '@/hooks';

export default function EmptyTemplate() {
  const { lng } = useLanguage();

  return (
    <div className="flex-center size-full flex-col gap-2 bg-slate-50">
      <header className="flex h-14 w-full items-center justify-end px-8">
        <div className="flex items-center gap-2">
          <LuGlobe className="text-primary h-5 w-5" />
          <span className="font-bold">BRIEND - {LANGUAGE_NAME[lng]}</span>
        </div>
      </header>
      <section className="flex-center text-primary/30 flex-1 flex-col gap-2">
        <Logo className="text-primary/30 w-40" />
      </section>
      <footer className="flex-center h-14 w-full px-8">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} BRIEND. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

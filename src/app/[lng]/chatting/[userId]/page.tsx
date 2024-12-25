'use client';

import { useShallow } from 'zustand/shallow';

import { usePeerStore } from '@/stores';

import { UserActionSection } from './_components/UserActionSection';

const ChattingPage = () => {
  const [friendConnectionMap] = usePeerStore(
    useShallow((state) => [state.friendConnectionMap]),
  );

  console.log(friendConnectionMap);

  return <article className="h-full bg-slate-100">ss</article>;
};

export default ChattingPage;

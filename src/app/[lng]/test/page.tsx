'use client';

import { trpc } from '@/utils/trpc';

const TestPage = () => {
  const hello = trpc.hello.useQuery({ text: 'TRPC' });

  if (!hello.data) return <div>로딩중...</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">TRPC 테스트 페이지</h1>
      <div>{hello.data.greeting}</div>
    </div>
  );
};

export default TestPage;

'use client';

import { useEffect, use } from 'react';

import { ChattingBottomTextfield } from './_components/ChattingBottomTextfield';

interface ChattingPageProps {
  searchParams: Promise<{
    channelId: string;
  }>;
}

const ChattingPage = (props: ChattingPageProps) => {
  const searchParams = use(props.searchParams);

  const { channelId } = searchParams;

  useEffect(() => {}, []);

  return (
    <article>
      {channelId}
      <ChattingBottomTextfield />
    </article>
  );
};

export default ChattingPage;

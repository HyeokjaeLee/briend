'use client';

import { useEffect, use } from 'react';

interface ChattingPageProps {
  searchParams: Promise<{
    channelId: string;
  }>;
}

const ChattingPage = (props: ChattingPageProps) => {
  const searchParams = use(props.searchParams);

  const { channelId } = searchParams;

  useEffect(() => {}, []);

  return <article>{channelId}</article>;
};

export default ChattingPage;

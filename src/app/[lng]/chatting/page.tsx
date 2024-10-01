'use client';

import { useEffect } from 'react';

interface ChattingPageProps {
  searchParams: {
    channelId: string;
  };
}

const ChattingPage = ({ searchParams: { channelId } }: ChattingPageProps) => {
  useEffect(() => {}, []);

  return <article>{channelId}</article>;
};

export default ChattingPage;

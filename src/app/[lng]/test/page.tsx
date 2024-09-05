'use client';

import { useSession } from 'next-auth/react';

const Test = () => {
  const test = useSession();
  test.status;

  return <></>;
};

export default Test;

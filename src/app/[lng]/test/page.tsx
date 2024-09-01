'use client';

import { useSession } from 'next-auth/react';

const Test = () => {
  const test = useSession();
  test.status;

  console.log(test);
  return <></>;
};

export default Test;

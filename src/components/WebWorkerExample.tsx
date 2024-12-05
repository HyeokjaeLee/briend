'use client';

import { useEffect, useState } from 'react';

export const WebWorkerExample = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const worker = new Worker(
      new URL('@/workers/chatting.worker.ts', import.meta.url),
    );

    worker.onmessage = (event) => {
      setCount(event.data);
    };
  }, []);

  return (
    <div>
      <h2>웹워커로부터 받은 카운트: {count}</h2>
    </div>
  );
};

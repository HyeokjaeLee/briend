'use client';

import Link from 'next/link';

const MorePage = () => {
  return (
    <div className="flex flex-col gap-2">
      more
      <Link href="?test=1">push</Link>
      <Link replace href="?test=2">
        replace
      </Link>
      <button
        onClick={() => {
          history.back();
        }}
      >
        back
      </button>
      <button
        onClick={() => {
          history.forward();
        }}
      >
        forward
      </button>
    </div>
  );
};

export default MorePage;

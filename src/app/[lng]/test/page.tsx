'use client';

import { Avatar } from '@radix-ui/themes';

import { Skeleton } from './skeleton';

export default function TestPage() {
  return (
    <article className="p-4">
      <Skeleton>
        <Avatar
          src="https://github.com/shadcn.png"
          fallback="ss"
          className="rounded-b-2xl"
        />
      </Skeleton>
    </article>
  );
}

export const dynamic = 'force-static';

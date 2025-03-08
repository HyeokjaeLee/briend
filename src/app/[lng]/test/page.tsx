'use client';

import { Ri24HoursFill } from 'react-icons/ri';

import { Button } from '@/components';
import { toast } from '@/utils/client';

export default function TestPage() {
  return (
    <article className="p-4">
      <Button size="8" onlyIcon>
        <Ri24HoursFill />
      </Button>
      <Button
        onClick={() =>
          toast({
            message: Math.random().toString(),
          })
        }
      >
        Toast
      </Button>
    </article>
  );
}

export const dynamic = 'force-static';

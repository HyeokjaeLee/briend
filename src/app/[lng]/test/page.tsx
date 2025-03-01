'use client';

import { Ri24HoursFill } from 'react-icons/ri';

import { CustomButton } from '@/components';
import { toast } from '@/utils/client';

import { Button } from './button';

export default function TestPage() {
  return (
    <article className="p-4">
      <CustomButton
        onClick={() =>
          toast({
            message: 'Toast message',
          })
        }
      >
        <Ri24HoursFill />
        Toast
      </CustomButton>
      <Button>
        <Ri24HoursFill />
        Toast
      </Button>
      <div className="flex">
        <Button size="8">
          <Ri24HoursFill />
          Toast
        </Button>
        <Button size="8" variant="ghost">
          Toast
        </Button>
        <Button size="14" variant="outline">
          Test
        </Button>
        <Button size="14" variant="secondary">
          <Ri24HoursFill />
          fqwfq
        </Button>
      </div>
      ss
    </article>
  );
}

export const dynamic = 'force-static';

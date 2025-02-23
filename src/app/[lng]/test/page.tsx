'use client';

import { Ri24HoursFill } from 'react-icons/ri';

import { CustomButton } from '@/components';
import { Button } from '@/components/_shadcn/button';
import { toast } from '@/utils/client';

export default function TestPage() {
  return (
    <article>
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
    </article>
  );
}

export const dynamic = 'force-static';

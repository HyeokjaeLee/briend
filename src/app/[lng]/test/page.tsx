'use client';

import { Ri24HoursFill } from 'react-icons/ri';

import { CustomButton } from '@/components';
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
    </article>
  );
}

export const dynamic = 'force-static';

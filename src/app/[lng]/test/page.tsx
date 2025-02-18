'use client';

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
        Toast
      </CustomButton>
    </article>
  );
}

export const dynamic = 'force-static';

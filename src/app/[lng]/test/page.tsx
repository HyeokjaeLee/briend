'use client';

import { trpc } from '@/app/trpc';
import { CustomButton } from '@/components';

export default function TestPage() {
  const test = trpc.chat.sendMessage.useMutation();

  return (
    <article>
      <CustomButton
        onClick={() =>
          test.mutate({
            message: 'test',
          })
        }
      >
        Test
      </CustomButton>
    </article>
  );
}

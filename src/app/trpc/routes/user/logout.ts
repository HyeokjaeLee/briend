import { privateProcedure } from '@/app/trpc/settings';
import { signOut } from '@/auth';

export const logout = privateProcedure.mutation(async () => {
  await signOut({
    redirect: false,
  });

  return true;
});

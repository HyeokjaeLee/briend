import { privateProcedure } from '@/configs/trpc/settings';
import { signOut } from '@/auth';

export const logout = privateProcedure.mutation(async () => {
  await signOut({
    redirect: false,
  });

  return true;
});

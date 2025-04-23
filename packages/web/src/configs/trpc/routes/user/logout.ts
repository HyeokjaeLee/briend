import { signOut } from '@/configs/auth';
import { privateProcedure } from '@/configs/trpc/settings';

export const logout = privateProcedure.mutation(async () => {
  await signOut({
    redirect: false,
  });

  return true;
});

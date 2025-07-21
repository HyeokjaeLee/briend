import { createClient } from '@/database/supabase/server';
import type { UserSession } from '@/types/next-auth';

import { privateProcedure } from '../../settings';

export const data = privateProcedure.mutation(
  async ({
    ctx: {
      session: { user },
    },
  }) => {
    const userId = user.id;
    const supabase = await createClient();

    // Get user from Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser.user) {
      throw new Error('User not authenticated');
    }

    // Get additional user data from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error('Failed to fetch user data');
    }

    return {
      id: authUser.user.id,
      name: userData?.username || authUser.user.user_metadata?.name || null,
      profileImage: userData?.avatar || authUser.user.user_metadata?.avatar_url || null,
      email: authUser.user.email,
      ...userData,
    } satisfies UserSession;
  },
);

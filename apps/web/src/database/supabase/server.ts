import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { PUBLIC_ENV } from '@/constants';
import type { Database } from '@briend/config';

// Create a Supabase client configured for server-side usage
export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    PUBLIC_ENV.SUPABASE_URL || 'https://grawoqitzzxiwuylkwsw.supabase.co',
    PUBLIC_ENV.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyYXdvcWl0enp4aXd1eWxrd3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMDcxMTEsImV4cCI6MjA2ODY4MzExMX0.c5jWQUYynE8_e2vZLc_aQAxC7LogHut9Jkg1xBmTwiM',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};
import { createBrowserClient } from '@supabase/ssr';

import { PUBLIC_ENV } from '@/constants';
import type { Database } from '@briend/config';

// Create a singleton Supabase client for client-side usage
export const createClient = () => {
  return createBrowserClient<Database>(
    PUBLIC_ENV.SUPABASE_URL || 'https://grawoqitzzxiwuylkwsw.supabase.co',
    PUBLIC_ENV.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyYXdvcWl0enp4aXd1eWxrd3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMDcxMTEsImV4cCI6MjA2ODY4MzExMX0.c5jWQUYynE8_e2vZLc_aQAxC7LogHut9Jkg1xBmTwiM'
  );
};

// Create Supabase client instance
export const supabase = createClient();
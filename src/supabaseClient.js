import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://revyqrxfskxrynzmexnq.supabase.co'; // Tu Project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldnlxcnhmc2t4cnluem1leG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NzExNjYsImV4cCI6MjEwNTQ0NzE2Nn0.c4ozS2z62HQyzjJXGx9pO3Vs9gbVr1bKiv0ml8rWJds';          // Tu key pública 'anon'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

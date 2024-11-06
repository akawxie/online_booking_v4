import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = 'https://klvzpkizmqmivzvnpojd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsdnpwa2l6bXFtaXZ6dm5wb2pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4ODExMjUsImV4cCI6MjA0NjQ1NzEyNX0.9SuRnmSuGtC33sBVR3bsQqnloUE7XwQ-sYksrweEsmQ';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
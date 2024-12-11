import { createClient } from '@supabase/supabase-js';
import { type Database } from './supabase';

const supabase = (options: { headers?: Record<string, string> } = {}) => createClient<Database>(import.meta.env.VITE_DATABASE_URL, import.meta.env.VITE_DATABASE_APIKEY, {
    global: {
        headers: options.headers
    }
});

export default supabase;
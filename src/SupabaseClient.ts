import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase';

const client = createClient<Database>(import.meta.env.VITE_DATABASE_URL, import.meta.env.VITE_DATABASE_APIKEY);

const supabase = () => client

export default supabase;
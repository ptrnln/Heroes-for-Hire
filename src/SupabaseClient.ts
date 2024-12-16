import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { type Database } from './supabase';

const client = createClient<Database>(
    import.meta.env.VITE_DATABASE_URL,
    import.meta.env.VITE_DATABASE_APIKEY,
);

export default function useSupabase():SupabaseClient<Database> {
    return client;
}
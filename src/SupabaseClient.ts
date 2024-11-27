import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_DATABASE_URL, import.meta.env.VITE_DATABASE_APIKEY);

export default supabase
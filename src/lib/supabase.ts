import { createClient } from '@supabase/supabase-js'
import { env } from './env'

const createSupabaseClient = () =>
    createClient(env.supabaseUrl, env.supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
    })

// Prevent duplicate instances during Next.js HMR
const globalForSupabase = globalThis as unknown as {
    __supabase?: ReturnType<typeof createSupabaseClient>
}

export const supabase =
    globalForSupabase.__supabase ?? (globalForSupabase.__supabase = createSupabaseClient())

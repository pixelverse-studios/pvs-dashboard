import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from './env'

const globalForSupabase = globalThis as unknown as {
    __supabase?: SupabaseClient
}

const createSupabaseClient = () =>
    createClient(env.supabaseUrl, env.supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
    })

export const getSupabase = (): SupabaseClient => {
    if (!globalForSupabase.__supabase) {
        globalForSupabase.__supabase = createSupabaseClient()
    }
    return globalForSupabase.__supabase
}

// Re-export as `supabase` for convenience — only call from client-side code
export const supabase = typeof window !== 'undefined' ? getSupabase() : (null as unknown as SupabaseClient)

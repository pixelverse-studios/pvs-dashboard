import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

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

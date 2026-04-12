import { getSupabase } from '@/lib/supabase'

export const signInWithGoogle = async (redirectTo?: string) => {
    const supabase = getSupabase()
    const target = redirectTo ?? `${window.location.origin}/`

    if (typeof window !== 'undefined') {
        const origin = window.location.origin
        if (!target.startsWith(origin)) {
            throw new Error('redirectTo must be a same-origin URL')
        }
    }

    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: target,
            queryParams: {
                access_type: 'offline',
                prompt: 'select_account',
            },
        },
    })
    if (error) throw error
}

export const signOut = async () => {
    const supabase = getSupabase()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

// Reads from Supabase's localStorage cache — no server round-trip.
// Use getUser() instead for security-sensitive identity verification.
export const getSession = async () => {
    const supabase = getSupabase()
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
}

export const getUser = async () => {
    const supabase = getSupabase()
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
}

export const getAccessToken = async (): Promise<string | null> => {
    const session = await getSession()
    return session?.access_token ?? null
}

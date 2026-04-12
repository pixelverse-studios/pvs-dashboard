import { supabase } from './supabase'

export const signInWithGoogle = async (redirectTo?: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectTo || `${window.location.origin}/`,
            queryParams: {
                access_type: 'offline',
                prompt: 'select_account',
            },
        },
    })
    if (error) throw error
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

export const getSession = async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
}

export const getAccessToken = async (): Promise<string | null> => {
    const session = await getSession()
    return session?.access_token || null
}

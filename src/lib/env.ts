const required = (key: string): string => {
    const value = process.env[key]
    if (!value || !value.trim()) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
    return value
}

export const env = {
    apiBaseUrl: required('NEXT_PUBLIC_API_BASE_URL'),
    supabaseUrl: required('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseAnonKey: required('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    devHostname: process.env.NEXT_PUBLIC_DEV_HOSTNAME?.trim() || null,
}

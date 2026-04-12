const required = (key: string): string => {
    const value = process.env[key]
    if (!value || !value.trim()) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
    return value.trim()
}

const isBuildTime =
    typeof window === 'undefined' && process.env.NODE_ENV === 'production'

export const env = {
    get apiBaseUrl() {
        return isBuildTime ? '' : required('NEXT_PUBLIC_API_BASE_URL')
    },
    get supabaseUrl() {
        return isBuildTime ? '' : required('NEXT_PUBLIC_SUPABASE_URL')
    },
    get supabaseAnonKey() {
        return isBuildTime ? '' : required('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    },
    get devHostname() {
        return process.env.NEXT_PUBLIC_DEV_HOSTNAME?.trim() || null
    },
}

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

export const env = {
    get apiBaseUrl() {
        const value = process.env.NEXT_PUBLIC_API_BASE_URL
        if (!isBuildPhase && (!value || !value.trim())) {
            throw new Error('Missing required environment variable: NEXT_PUBLIC_API_BASE_URL')
        }
        return value?.trim() ?? ''
    },
    get supabaseUrl() {
        const value = process.env.NEXT_PUBLIC_SUPABASE_URL
        if (!isBuildPhase && (!value || !value.trim())) {
            throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL')
        }
        return value?.trim() ?? ''
    },
    get supabaseAnonKey() {
        const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        if (!isBuildPhase && (!value || !value.trim())) {
            throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
        }
        return value?.trim() ?? ''
    },
    get devHostname() {
        return process.env.NEXT_PUBLIC_DEV_HOSTNAME?.trim() || null
    },
}

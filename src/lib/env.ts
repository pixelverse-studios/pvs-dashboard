const required = (key: string): string => {
    const value = process.env[key]
    if (!value || !value.trim()) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
    return value.trim()
}

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

export const env = {
    get apiBaseUrl() {
        return isBuildPhase ? '' : required('NEXT_PUBLIC_API_BASE_URL')
    },
    get supabaseUrl() {
        return isBuildPhase ? '' : required('NEXT_PUBLIC_SUPABASE_URL')
    },
    get supabaseAnonKey() {
        return isBuildPhase ? '' : required('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    },
    get devHostname() {
        return process.env.NEXT_PUBLIC_DEV_HOSTNAME?.trim() || null
    },
}

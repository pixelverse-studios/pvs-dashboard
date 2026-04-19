import { env } from './env'

const LOCAL_HOSTNAMES = new Set([
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
])

export const isLocalHostname = (hostname: string) =>
    LOCAL_HOSTNAMES.has(hostname.toLowerCase())

export const getCurrentHostname = (): string => {
    if (env.devHostname) return env.devHostname
    if (typeof window === 'undefined') return ''
    return window.location.hostname
}

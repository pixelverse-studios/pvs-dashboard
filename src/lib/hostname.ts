import { env } from './env'

export const getCurrentHostname = (): string => {
    if (env.devHostname) return env.devHostname
    if (typeof window === 'undefined') return ''
    return window.location.hostname
}

import { ApiError } from './api-error'
import { apiClient } from './api-client'
import { apiPaths } from './api-paths'
import type { ResolvedWebsiteContext } from '../types/branding'

export const resolveHostname = async (
    hostname: string,
): Promise<ResolvedWebsiteContext | null> => {
    try {
        return await apiClient.get<ResolvedWebsiteContext>(
            apiPaths.resolveHostname(hostname),
            { auth: false },
        )
    } catch (err) {
        if (err instanceof ApiError && err.isNotFound) {
            return null
        }
        console.error('[branding] Failed to resolve hostname:', err)
        return null
    }
}

import { apiClient } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import type { MeResponse } from '@/types/me'

export const fetchMe = async (): Promise<MeResponse> => {
    return await apiClient.get<MeResponse>(apiPaths.me)
}

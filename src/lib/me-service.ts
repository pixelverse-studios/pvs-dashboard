import { apiClient } from './api-client'
import { apiPaths } from './api-paths'
import type { MeResponse } from '../types/me'

export const fetchMe = async (): Promise<MeResponse> => {
    return await apiClient.get<MeResponse>(apiPaths.me)
}

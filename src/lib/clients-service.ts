import { apiClient } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import type { ClientsResponse } from '@/types/client'

export const fetchClients = async (): Promise<ClientsResponse> => {
    return await apiClient.get<ClientsResponse>(apiPaths.clients, {
        auth: false,
    })
}

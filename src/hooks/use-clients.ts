import { useQuery } from '@tanstack/react-query'
import { fetchClients } from '@/lib/clients-service'

export const useClients = (enabled: boolean) => {
    return useQuery({
        queryKey: ['clients'],
        queryFn: fetchClients,
        enabled,
        staleTime: 5 * 60_000,
    })
}

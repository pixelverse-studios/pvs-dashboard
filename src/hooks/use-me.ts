import { useQuery } from '@tanstack/react-query'
import { fetchMe } from '@/lib/me-service'

export const useMe = (enabled: boolean) => {
    return useQuery({
        queryKey: ['me'],
        queryFn: fetchMe,
        enabled,
        staleTime: 60_000,
    })
}

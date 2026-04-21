import { useQuery } from '@tanstack/react-query'
import { listPagesForClient } from '@/lib/cms-pages-service'

export const useCmsPages = (clientId: string | null) => {
    return useQuery({
        queryKey: ['cms-pages', clientId],
        queryFn: () => listPagesForClient(clientId!),
        enabled: !!clientId,
        staleTime: 30_000,
    })
}

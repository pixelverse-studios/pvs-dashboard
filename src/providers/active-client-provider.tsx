'use client'

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    type ReactNode,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useClients } from '@/hooks/use-clients'
import { useAuth } from '@/providers/auth-provider'
import type { ClientAssignmentWebsite } from '@/types/me'
import type { ClientSummary, ClientListItem } from '@/types/client'

const STORAGE_KEY = 'pvs-dashboard:active-client-id'

export interface ActiveClient {
    id: string
    firstname: string | null
    lastname: string | null
    company_name: string | null
}

interface ActiveClientContextValue {
    activeClient: ActiveClient | null
    activeWebsite: ClientAssignmentWebsite | null
    setActiveClient: (clientId: string) => void
    availableClients: ActiveClient[]
    isLoading: boolean
}

const ActiveClientContext = createContext<ActiveClientContextValue | null>(null)

const toActiveClient = (
    client: ClientSummary | ClientListItem | null,
): ActiveClient | null => {
    if (!client) return null

    const id = 'id' in client ? client.id : client.client_id
    if (!id) return null

    return {
        id,
        firstname: client.firstname,
        lastname: client.lastname,
        company_name: client.company_name,
    }
}

const readStoredClientId = () => {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(STORAGE_KEY)
}

const writeStoredClientId = (clientId: string) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, clientId)
}

const getClientIdFromPath = (pathname: string): string | null => {
    const match = pathname.match(/^\/clients\/([^/]+)/)
    return match?.[1] ?? null
}

export const useActiveClient = () => {
    const ctx = useContext(ActiveClientContext)
    if (!ctx) {
        throw new Error('useActiveClient must be used within <ActiveClientProvider>')
    }
    return ctx
}

export const ActiveClientProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter()
    const pathname = usePathname()
    const { me, isAuthenticated, isLoadingMe, isPvsAdmin } = useAuth()
    const clientsQuery = useClients(isAuthenticated && isPvsAdmin)
    const unauthorizedToastShownRef = useRef<string | null>(null)

    const assignmentClients = useMemo(() => {
        const deduped = new Map<string, ActiveClient>()

        for (const assignment of me?.assignments ?? []) {
            const client = toActiveClient(assignment.client)
            if (!client || deduped.has(client.id)) continue
            deduped.set(client.id, client)
        }

        return Array.from(deduped.values())
    }, [me?.assignments])

    const availableClients = useMemo(() => {
        if (isPvsAdmin) {
            const clients = clientsQuery.data?.clients ?? []
            return clients
                .map((client) => toActiveClient(client))
                .filter((client): client is ActiveClient => client !== null)
        }

        return assignmentClients
    }, [assignmentClients, clientsQuery.data?.clients, isPvsAdmin])

    const activeClientIdFromUrl = getClientIdFromPath(pathname)

    const fallbackClient = useMemo(() => {
        const storedClientId = readStoredClientId()

        if (storedClientId) {
            const storedClient = availableClients.find(
                (client) => client.id === storedClientId,
            )
            if (storedClient) return storedClient
        }

        if (!isPvsAdmin) {
            return assignmentClients[0] ?? null
        }

        return availableClients[0] ?? null
    }, [assignmentClients, availableClients, isPvsAdmin])

    const activeClient = useMemo(() => {
        if (activeClientIdFromUrl) {
            return (
                availableClients.find((client) => client.id === activeClientIdFromUrl) ??
                null
            )
        }

        return fallbackClient
    }, [activeClientIdFromUrl, availableClients, fallbackClient])

    const activeWebsite = useMemo(() => {
        if (!activeClient) return null
        const assignment = me?.assignments.find(
            (item) => item.client_id === activeClient.id,
        )
        return assignment?.websites[0] ?? null
    }, [activeClient, me?.assignments])

    const isLoading = isLoadingMe || (isPvsAdmin && clientsQuery.isLoading)

    useEffect(() => {
        if (!activeClient) return
        writeStoredClientId(activeClient.id)
    }, [activeClient])

    useEffect(() => {
        if (isLoading) return
        if (!activeClientIdFromUrl) return
        if (activeClientIdFromUrl === 'undefined') return

        const isAccessible = availableClients.some(
            (client) => client.id === activeClientIdFromUrl,
        )

        if (isAccessible) {
            unauthorizedToastShownRef.current = null
            return
        }

        if (!fallbackClient) return

        if (unauthorizedToastShownRef.current !== activeClientIdFromUrl) {
            toast.error("You don't have access to that client")
            unauthorizedToastShownRef.current = activeClientIdFromUrl
        }

        if (!fallbackClient.id) return
        router.replace(`/clients/${fallbackClient.id}/pages`)
    }, [
        activeClientIdFromUrl,
        availableClients,
        fallbackClient,
        isLoading,
        router,
    ])

    const value = useMemo<ActiveClientContextValue>(
        () => ({
            activeClient,
            activeWebsite,
            setActiveClient: (clientId: string) => {
                if (!clientId) return
                writeStoredClientId(clientId)
                router.push(`/clients/${clientId}/pages`)
            },
            availableClients,
            isLoading,
        }),
        [activeClient, activeWebsite, availableClients, isLoading, router],
    )

    return (
        <ActiveClientContext.Provider value={value}>
            {children}
        </ActiveClientContext.Provider>
    )
}

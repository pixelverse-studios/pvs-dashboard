'use client'

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react'
import { usePathname } from 'next/navigation'
import { resolveHostname } from '@/lib/branding-service'
import { applyBranding, resetBranding } from '@/lib/apply-branding'
import { getCurrentHostname, isLocalHostname } from '@/lib/hostname'
import { FullScreenLoader } from '@/components/full-screen-loader'
import { useActiveClient } from '@/providers/active-client-provider'
import type { ResolvedWebsiteContext } from '@/types/branding'

export type AppMode = 'dashboard' | 'client'

interface BrandingContextValue {
    website: ResolvedWebsiteContext | null
    shellWebsite: ResolvedWebsiteContext | null
    isLoading: boolean
    isResolved: boolean
    mode: AppMode
    shouldResolveHostname: boolean
}

const BrandingContext = createContext<BrandingContextValue>({
    website: null,
    shellWebsite: null,
    isLoading: true,
    isResolved: false,
    mode: 'dashboard',
    shouldResolveHostname: false,
})

export const useBranding = () => useContext(BrandingContext)

interface BrandingState {
    hostname: string | null
    website: ResolvedWebsiteContext | null
    isLoading: boolean
    isResolved: boolean
}

const resolvedEmpty: BrandingState = {
    hostname: null,
    website: null,
    isLoading: false,
    isResolved: true,
}

const pendingState: BrandingState = {
    hostname: null,
    website: null,
    isLoading: true,
    isResolved: false,
}

export const BrandingProvider = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname()
    const { activeWebsite } = useActiveClient()
    const currentHostname = getCurrentHostname()
    const nonLocalCurrentHostname =
        currentHostname && !isLocalHostname(currentHostname)
            ? currentHostname
            : null
    const isLoginRoute = pathname === '/login'
    const mode: AppMode = pathname.startsWith('/clients/')
        ? 'client'
        : 'dashboard'
    const brandedHostname =
        mode === 'client'
            ? activeWebsite?.domain ?? nonLocalCurrentHostname
            : currentHostname
    const shouldResolveHostname =
        !!brandedHostname &&
        (mode === 'client'
            ? true
            : !isLocalHostname(brandedHostname) && isLoginRoute)

    const [resolvedState, setResolvedState] = useState<BrandingState>(
        pendingState,
    )

    useEffect(() => {
        if (!shouldResolveHostname) {
            resetBranding()
            return
        }

        let cancelled = false

        resolveHostname(brandedHostname)
            .then((result) => {
                if (cancelled) return
                if (result) {
                    applyBranding(result.branding)
                }
                setResolvedState({
                    hostname: brandedHostname,
                    website: result,
                    isLoading: false,
                    isResolved: true,
                })
            })
            .catch(() => {
                if (cancelled) return
                setResolvedState({
                    hostname: brandedHostname,
                    website: null,
                    isLoading: false,
                    isResolved: true,
                })
            })

        return () => {
            cancelled = true
            resetBranding()
        }
    }, [brandedHostname, shouldResolveHostname])

    const state =
        shouldResolveHostname && resolvedState.hostname !== brandedHostname
            ? pendingState
            : shouldResolveHostname
              ? resolvedState
              : resolvedEmpty
    const shellWebsite = mode === 'client' ? state.website : null

    useEffect(() => {
        const name = shellWebsite
            ? shellWebsite.website_title ||
              shellWebsite.client.company_name ||
              'CMS Dashboard'
            : mode === 'dashboard'
              ? 'PVS Dashboard'
              : 'CMS Dashboard'

        document.title = `${name} CMS`
    }, [mode, shellWebsite])

    if (state.isLoading) {
        return <FullScreenLoader />
    }

    return (
        <BrandingContext.Provider
            value={{
                ...state,
                shellWebsite,
                mode,
                shouldResolveHostname,
            }}
        >
            {children}
        </BrandingContext.Provider>
    )
}

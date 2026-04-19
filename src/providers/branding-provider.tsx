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
    website: ResolvedWebsiteContext | null
    isLoading: boolean
    isResolved: boolean
}

const resolvedEmpty: BrandingState = {
    website: null,
    isLoading: false,
    isResolved: true,
}

const pendingState: BrandingState = {
    website: null,
    isLoading: true,
    isResolved: false,
}

export const BrandingProvider = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname()
    const hostname = getCurrentHostname()
    const isLoginRoute = pathname === '/login'
    const mode: AppMode = pathname.startsWith('/clients/')
        ? 'client'
        : 'dashboard'
    const shouldResolveHostname =
        !!hostname &&
        !isLocalHostname(hostname) &&
        (mode === 'client' || isLoginRoute)

    const [resolvedState, setResolvedState] = useState<BrandingState>(
        pendingState,
    )

    useEffect(() => {
        if (!shouldResolveHostname) {
            resetBranding()
            return
        }

        let cancelled = false

        resolveHostname(hostname)
            .then((result) => {
                if (cancelled) return
                if (result) {
                    applyBranding(result.branding)
                }
                setResolvedState({
                    website: result,
                    isLoading: false,
                    isResolved: true,
                })
            })
            .catch(() => {
                if (cancelled) return
                setResolvedState({
                    website: null,
                    isLoading: false,
                    isResolved: true,
                })
            })

        return () => {
            cancelled = true
            resetBranding()
        }
    }, [hostname, shouldResolveHostname])

    const state = shouldResolveHostname ? resolvedState : resolvedEmpty
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

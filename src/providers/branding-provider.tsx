'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { resolveHostname } from '@/lib/branding-service'
import { applyBranding, resetBranding } from '@/lib/apply-branding'
import { getCurrentHostname } from '@/lib/hostname'
import { FullScreenLoader } from '@/components/full-screen-loader'
import type { ResolvedWebsiteContext } from '@/types/branding'

interface BrandingContextValue {
    website: ResolvedWebsiteContext | null
    isLoading: boolean
    isResolved: boolean
}

const BrandingContext = createContext<BrandingContextValue>({
    website: null,
    isLoading: true,
    isResolved: false,
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

export const BrandingProvider = ({ children }: { children: ReactNode }) => {
    const hostname = getCurrentHostname()

    const [state, setState] = useState<BrandingState>(
        hostname ? { website: null, isLoading: true, isResolved: false } : resolvedEmpty,
    )

    useEffect(() => {
        if (!hostname) return

        let cancelled = false

        resolveHostname(hostname)
            .then((result) => {
                if (cancelled) return
                if (result) {
                    applyBranding(result.branding)
                }
                setState({
                    website: result,
                    isLoading: false,
                    isResolved: true,
                })
            })
            .catch(() => {
                if (cancelled) return
                setState({
                    website: null,
                    isLoading: false,
                    isResolved: true,
                })
            })

        return () => {
            cancelled = true
            resetBranding()
        }
    }, [hostname])

    if (state.isLoading) {
        return <FullScreenLoader />
    }

    return (
        <BrandingContext.Provider value={state}>
            {children}
        </BrandingContext.Provider>
    )
}

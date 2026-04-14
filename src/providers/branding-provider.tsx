'use client'

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react'
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

    const titleAppliedRef = useRef(false)
    useEffect(() => {
        if (!state.website || titleAppliedRef.current) return
        const { website_title, client } = state.website
        const name =
            website_title || client.company_name || 'CMS Dashboard'
        document.title = `${name} CMS`
        titleAppliedRef.current = true
    }, [state.website])

    if (state.isLoading) {
        return <FullScreenLoader />
    }

    return (
        <BrandingContext.Provider value={state}>
            {children}
        </BrandingContext.Provider>
    )
}

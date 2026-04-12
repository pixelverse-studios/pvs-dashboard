'use client'

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Session } from '@supabase/supabase-js'
import { getSupabase } from '@/lib/supabase'
import { useMe } from '@/hooks/use-me'
import type { MeResponse } from '@/types/me'
import '@/lib/auth-bridge'

interface AuthContextValue {
    session: Session | null
    isLoadingSession: boolean
    me: MeResponse | null
    isLoadingMe: boolean
    meError: Error | null
    isAuthenticated: boolean
    isPvsAdmin: boolean
    hasAnyAccess: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error('useAuth must be used within <AuthProvider>')
    }
    return ctx
}

interface SessionState {
    session: Session | null
    isLoading: boolean
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient()
    const [sessionState, setSessionState] = useState<SessionState>({
        session: null,
        isLoading: true,
    })

    useEffect(() => {
        const supabase = getSupabase()

        const { data: subscription } = supabase.auth.onAuthStateChange(
            (event, nextSession) => {
                setSessionState({ session: nextSession, isLoading: false })

                if (event === 'SIGNED_OUT') {
                    queryClient.removeQueries({ queryKey: ['me'] })
                }
            },
        )

        return () => {
            subscription.subscription.unsubscribe()
        }
    }, [queryClient])

    const meQuery = useMe(!!sessionState.session)
    const me = meQuery.data ?? null

    const value: AuthContextValue = {
        session: sessionState.session,
        isLoadingSession: sessionState.isLoading,
        me,
        isLoadingMe: meQuery.isLoading,
        meError: meQuery.error,
        isAuthenticated: !!sessionState.session,
        isPvsAdmin: !!me?.is_pvs_admin,
        hasAnyAccess:
            !!me && (me.is_pvs_admin || me.assignments.length > 0),
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

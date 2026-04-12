'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { useMe } from '../hooks/use-me'
import type { MeResponse } from '../types/me'
import '../lib/auth-bridge'

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

const AuthContext = createContext<AuthContextValue>({
    session: null,
    isLoadingSession: true,
    me: null,
    isLoadingMe: false,
    meError: null,
    isAuthenticated: false,
    isPvsAdmin: false,
    hasAnyAccess: false,
})

export const useAuth = () => useContext(AuthContext)

interface SessionState {
    session: Session | null
    isLoading: boolean
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [sessionState, setSessionState] = useState<SessionState>({
        session: null,
        isLoading: true,
    })

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSessionState({ session: data.session, isLoading: false })
        })

        const { data: subscription } = supabase.auth.onAuthStateChange(
            (_event, nextSession) => {
                setSessionState({ session: nextSession, isLoading: false })
            },
        )

        return () => {
            subscription.subscription.unsubscribe()
        }
    }, [])

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
        hasAnyAccess: !!me && (me.is_pvs_admin || me.assignments.length > 0),
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

'use client'

import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { useBranding } from '@/providers/branding-provider'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { DashboardTopbar } from '@/components/layout/dashboard-topbar'
import { FullScreenLoader } from '@/components/full-screen-loader'
import { NoAccessState } from '@/components/no-access-state'

export default function DashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    const { isLoadingSession, isLoadingMe, isAuthenticated, hasAnyAccess } =
        useAuth()
    const { isResolved } = useBranding()

    if (isLoadingSession || isLoadingMe || !isResolved) {
        return <FullScreenLoader />
    }

    if (!isAuthenticated) {
        redirect('/login')
    }

    if (!hasAnyAccess) {
        return <NoAccessState />
    }

    return (
        <div className="flex h-screen bg-background">
            <DashboardSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <DashboardTopbar />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

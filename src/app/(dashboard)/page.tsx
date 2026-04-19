'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FullScreenLoader } from '@/components/full-screen-loader'
import { useActiveClient } from '@/providers/active-client-provider'

export default function DashboardHome() {
    const router = useRouter()
    const { activeClient, isLoading } = useActiveClient()

    useEffect(() => {
        if (!activeClient) return
        router.replace(`/clients/${activeClient.id}/pages`)
    }, [activeClient, router])

    if (isLoading) {
        return <FullScreenLoader />
    }

    if (activeClient) {
        return <FullScreenLoader />
    }

    return (
        <div className="max-w-2xl rounded-2xl border border-border bg-card p-8">
            <h1 className="text-2xl font-semibold">No client selected</h1>
            <p className="mt-2 text-muted-foreground">
                Your account is signed in, but no editable client could be
                resolved yet.
            </p>
        </div>
    )
}

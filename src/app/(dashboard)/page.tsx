'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    ArrowRight,
    Building2,
    LayoutGrid,
    LogOut,
    PanelsTopLeft,
    Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FullScreenLoader } from '@/components/full-screen-loader'
import { signInWithGoogle, signOut } from '@/lib/auth-service'
import { useActiveClient } from '@/providers/active-client-provider'
import { useAuth } from '@/providers/auth-provider'
import { cn } from '@/lib/utils'

const getClientLabel = (
    client: ReturnType<typeof useActiveClient>['activeClient'],
) => {
    if (!client) return 'No client selected'

    return (
        client.company_name ||
        [client.firstname, client.lastname].filter(Boolean).join(' ') ||
        'Untitled client'
    )
}

export default function DashboardHome() {
    const router = useRouter()
    const { isPvsAdmin, session } = useAuth()
    const { activeClient, availableClients, isLoading } = useActiveClient()

    useEffect(() => {
        if (isPvsAdmin) return
        if (!activeClient) return
        router.replace(`/clients/${activeClient.id}/pages`)
    }, [activeClient, isPvsAdmin, router])

    if (isLoading) {
        return <FullScreenLoader />
    }

    if (!isPvsAdmin && activeClient) {
        return <FullScreenLoader />
    }

    const handleSignOut = () => {
        signOut().catch(() => {
            window.location.href = '/login'
        })
    }

    const handleSwitchAccount = async () => {
        try {
            await signOut()
            await signInWithGoogle()
        } catch {
            window.location.href = '/login'
        }
    }

    if (isPvsAdmin) {
        const adminEmail =
            session?.user?.email ?? 'phil@pixelversestudios.io'
        const activeClientLabel = getClientLabel(activeClient)

        return (
            <div className="min-h-full bg-[#fcfcfe]">
                <section className="border-b border-border/70 px-6 py-6 md:px-8 md:py-8 lg:px-10">
                    <div className="rounded-[1.75rem] border border-border/70 bg-white p-6 shadow-[0_24px_60px_-52px_rgba(17,17,17,0.5)] md:p-8">
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-[#f7f7fb] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                                    <Sparkles className="size-3.5" />
                                    PixelVerse Studios
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-semibold tracking-[-0.06em] text-foreground md:text-5xl">
                                        Command center
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        Signed in as {adminEmail}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[420px]">
                                <div className="rounded-[1.5rem] border border-border/70 bg-[#fbfbfd] p-4">
                                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Building2 className="size-4 text-primary" />
                                        Ready clients
                                    </div>
                                    <p className="text-3xl font-semibold tracking-tight text-foreground">
                                        {availableClients.length}
                                    </p>
                                </div>

                                <div className="rounded-[1.5rem] border border-border/70 bg-[#fbfbfd] p-4">
                                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <LayoutGrid className="size-4 text-primary" />
                                        Current focus
                                    </div>
                                    <p className="text-sm font-medium text-foreground">
                                        {activeClientLabel}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-border/70 pt-6">
                            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
                                <PanelsTopLeft className="size-4" />
                                Client jump list
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {availableClients.map((client, index) => (
                                    <Link
                                        key={client.id}
                                        href={`/clients/${client.id}/pages`}
                                        className={cn(
                                            'group rounded-[1.5rem] border border-border/70 bg-[#fcfcfe] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_16px_36px_-32px_rgba(63,0,233,0.22)]',
                                            index === 0 &&
                                                'border-primary/12 bg-[#f7f5ff]',
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-3">
                                                <p className="text-lg font-medium text-foreground">
                                                    {getClientLabel(client)}
                                                </p>
                                                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
                                                    Visit workspace
                                                </div>
                                            </div>
                                            <div className="rounded-2xl border border-border/70 bg-white p-3 text-primary transition-all duration-200 group-hover:border-primary/20 group-hover:bg-primary/6">
                                                <ArrowRight className="size-4" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-6 py-8 md:px-8 lg:px-10">
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
                        <div className="rounded-[1.5rem] border border-dashed border-border/80 bg-white p-6">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-[#f7f7fb] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                <PanelsTopLeft className="size-3.5" />
                                Next module
                            </div>
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                                Admin surfaces can land here next.
                            </h2>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                                Keep this page modular. As the CMS grows, this
                                area can absorb rollout status, activity,
                                deployment health, client alerts, or other
                                admin-first controls without disturbing the jump
                                list above.
                            </p>
                        </div>

                        <div className="rounded-[1.5rem] border border-border/80 bg-white p-6">
                            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                                <LayoutGrid className="size-4 text-primary" />
                                Current focus
                            </div>
                            <p className="text-lg font-medium text-foreground">
                                {activeClientLabel}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                The active client remains available from the
                                sidebar, while this page stays reserved for
                                higher-level admin workflows.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className="p-6 md:p-8">
            <div className="max-w-2xl rounded-2xl border border-border bg-card p-8">
                <h1 className="text-2xl font-semibold">No client selected</h1>
                <p className="mt-2 text-muted-foreground">
                    Your account is signed in, but no editable client could be
                    resolved yet.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button
                        onClick={handleSignOut}
                        variant="outline"
                        className="gap-2"
                    >
                        <LogOut className="size-4" />
                        Sign out
                    </Button>
                    <Button
                        onClick={handleSwitchAccount}
                        variant="ghost"
                        className="gap-2"
                    >
                        Try a different account
                        <ArrowRight className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

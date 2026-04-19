'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    ArrowRight,
    Building2,
    Compass,
    Globe,
    LayoutGrid,
    LogOut,
    Orbit,
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
            <div className="min-h-full overflow-hidden bg-[linear-gradient(180deg,rgba(63,0,233,0.06)_0%,rgba(63,0,233,0)_24%),radial-gradient(circle_at_top_left,rgba(201,71,255,0.10),transparent_28%),linear-gradient(180deg,#fff_0%,#fbfbff_100%)]">
                <section className="relative border-b border-border/80 px-6 pb-10 pt-6 md:px-8 md:pt-8 lg:px-10">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />
                        <div className="absolute right-8 top-6 h-48 w-48 rounded-full bg-secondary/12 blur-3xl" />
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                    </div>

                    <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
                        <div className="rounded-[2rem] border border-border/70 bg-white/85 p-8 shadow-[0_24px_80px_-48px_rgba(63,0,233,0.45)] backdrop-blur">
                            <div className="mb-8 flex items-start justify-between gap-6">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/6 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                                        <Sparkles className="size-3.5" />
                                        PixelVerse Studios
                                    </div>
                                    <div className="space-y-3">
                                        <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">
                                            Command center for every client
                                            workspace.
                                        </h1>
                                        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                                            Dashboard mode stays neutral for PVS
                                            admins. Use this space to orient,
                                            triage, and jump into any branded
                                            client CMS when you want to work
                                            inside their scope.
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden rounded-[1.75rem] border border-primary/10 bg-[linear-gradient(135deg,rgba(63,0,233,0.10),rgba(201,71,255,0.12))] p-4 md:block">
                                    <div className="flex size-16 items-center justify-center rounded-2xl bg-white/85 text-primary shadow-sm">
                                        <Orbit className="size-7" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-2xl border border-border/70 bg-background/90 p-5">
                                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <LayoutGrid className="size-4 text-primary" />
                                        Shell mode
                                    </div>
                                    <p className="text-sm leading-6 text-muted-foreground">
                                        Neutral PixelVerse control surface
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-border/70 bg-background/90 p-5">
                                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Building2 className="size-4 text-primary" />
                                        Ready clients
                                    </div>
                                    <p className="text-3xl font-semibold tracking-tight text-foreground">
                                        {availableClients.length}
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Active client workspaces available in
                                        this admin session.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-border/70 bg-background/90 p-5">
                                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Globe className="size-4 text-primary" />
                                        Current focus
                                    </div>
                                    <p className="text-sm font-medium text-foreground">
                                        {activeClientLabel}
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Signed in as {adminEmail}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,247,251,0.92))] p-6 shadow-[0_20px_60px_-44px_rgba(17,17,17,0.4)] backdrop-blur">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Compass className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        Quick launch
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Step into your most relevant workspace.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {activeClient && (
                                    <Button
                                        render={
                                            <Link
                                                href={`/clients/${activeClient.id}/pages`}
                                            />
                                        }
                                        className="h-11 w-full justify-between rounded-xl"
                                    >
                                        Open current client
                                        <ArrowRight className="size-4" />
                                    </Button>
                                )}

                                <Button
                                    onClick={handleSignOut}
                                    variant="outline"
                                    className="h-11 w-full justify-between rounded-xl"
                                >
                                    Sign out
                                    <LogOut className="size-4" />
                                </Button>
                            </div>

                            <div className="mt-6 rounded-2xl border border-border/70 bg-white/80 p-4">
                                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                    Current perspective
                                </p>
                                <p className="mt-3 text-lg font-medium text-foreground">
                                    {activeClientLabel}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    The client switcher stays in the shell, but
                                    this page is now your admin-first staging
                                    ground before you cross into client mode.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-6 py-8 md:px-8 lg:px-10">
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-primary">
                                Client jump list
                            </p>
                            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                                Launch a workspace
                            </h2>
                        </div>
                        <p className="max-w-xl text-right text-sm leading-6 text-muted-foreground">
                            Each card takes you straight into a client route.
                            That keeps `/` clean as the control center while
                            `/clients/:clientId/...` remains the canonical
                            workspace mode.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {availableClients.map((client, index) => (
                            <Link
                                key={client.id}
                                href={`/clients/${client.id}/pages`}
                                className={cn(
                                    'group relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-white/88 p-5 shadow-[0_18px_60px_-50px_rgba(17,17,17,0.35)] transition-all duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_24px_70px_-44px_rgba(63,0,233,0.32)]',
                                    index === 0 &&
                                        'bg-[linear-gradient(135deg,rgba(63,0,233,0.08),rgba(255,255,255,0.92)_48%,rgba(201,71,255,0.10))]',
                                )}
                            >
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-lg font-medium text-foreground">
                                            {getClientLabel(client)}
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                            Open client workspace
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-primary/8 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        <ArrowRight className="size-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
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

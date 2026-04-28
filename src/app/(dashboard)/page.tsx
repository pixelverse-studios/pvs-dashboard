'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    ArrowRight,
    Building2,
    CircleDot,
    Command,
    LayoutGrid,
    LogOut,
    PanelsTopLeft,
    ShieldCheck,
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

const CommandStrip = ({
    label,
    status,
}: {
    label: string
    status: string
}) => (
    <div className="flex items-center justify-between gap-4 border-b border-border bg-white/90 px-4 py-3 backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Command className="size-4" />
            </div>
            <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{status}</p>
            </div>
        </div>
        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[58%] rounded-full bg-primary" />
        </div>
    </div>
)

const WorkspaceMetric = ({
    label,
    value,
    icon: Icon,
    active,
}: {
    label: string
    value: string | number
    icon: React.ComponentType<{ className?: string }>
    active?: boolean
}) => (
    <div
        className={cn(
            'border-l-2 bg-white px-3 py-2',
            active ? 'border-primary bg-primary/4' : 'border-border',
        )}
    >
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <Icon className={cn('size-3.5', active && 'text-primary')} />
            {label}
        </div>
        <p className="mt-1 truncate text-2xl font-semibold tracking-[-0.055em] text-foreground">
            {value}
        </p>
    </div>
)

const ModuleSlot = ({
    label,
    title,
    detail,
}: {
    label: string
    title: string
    detail: string
}) => (
    <div className="border-t border-border px-4 py-4 first:border-t-0">
        <div className="inline-flex items-center gap-2 border-l-2 border-border pl-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <CircleDot className="size-3" />
            {label}
        </div>
        <h3 className="mt-3 text-base font-semibold tracking-[-0.035em] text-foreground">
            {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
    </div>
)

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
            <div className="mx-auto max-w-[1480px] space-y-6 px-5 py-8 md:px-8 md:py-10">
                <section className="border border-border bg-white">
                    <CommandStrip label="PVS command center" status="Admin workspace" />
                    <div className="grid gap-7 px-5 py-7 md:px-8 md:py-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
                        <div className="max-w-4xl space-y-5">
                            <div className="inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                <CircleDot className="size-3 text-primary" />
                                PixelVerse Studios
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-4xl font-semibold leading-[0.95] tracking-[-0.075em] text-foreground md:text-6xl">
                                    Command center.
                                </h1>
                                <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                                    Select a client workspace, confirm the current focus, and keep
                                    future admin modules organized without adding dashboard noise.
                                </p>
                            </div>
                            <div className="inline-flex max-w-full items-center gap-2 border border-border bg-[#f8f8f6] px-3 py-2 text-sm text-muted-foreground">
                                <ShieldCheck className="size-4 text-primary" />
                                <span className="truncate">Signed in as {adminEmail}</span>
                            </div>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                            <WorkspaceMetric
                                label="Ready clients"
                                value={availableClients.length}
                                icon={Building2}
                            />
                            <WorkspaceMetric
                                label="Current focus"
                                value={activeClientLabel}
                                icon={LayoutGrid}
                                active
                            />
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="overflow-hidden border border-border bg-white">
                        <div className="grid gap-5 px-5 py-5 md:grid-cols-[minmax(0,1fr)_140px] md:px-6">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    <PanelsTopLeft className="size-3.5 text-primary" />
                                    Client jump list
                                </div>
                                <div className="space-y-1.5">
                                    <h2 className="text-2xl font-semibold tracking-[-0.055em] text-foreground">
                                        Client workspaces
                                    </h2>
                                    <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                                        Open the page library for any active client workspace.
                                    </p>
                                </div>
                            </div>

                            <div className="border-l border-border pl-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Entries
                                </p>
                                <div className="mt-1 flex items-end gap-2">
                                    <span className="text-4xl font-semibold tracking-[-0.065em] text-foreground">
                                        {availableClients.length}
                                    </span>
                                    <span className="pb-1 text-sm text-muted-foreground">total</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border bg-[#f8f8f6]">
                            <div className="hidden gap-4 px-5 py-3 md:grid md:grid-cols-[52px_minmax(0,1fr)_160px_28px]">
                                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    No.
                                </p>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    Client
                                </p>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    Status
                                </p>
                            </div>

                            <div className="bg-white">
                                {availableClients.length === 0 ? (
                                    <div className="border-t border-border px-4 py-8 text-sm text-muted-foreground md:px-5">
                                        No client workspaces are available yet.
                                    </div>
                                ) : (
                                    availableClients.map((client, index) => {
                                        const active = client.id === activeClient?.id

                                        return (
                                            <Link
                                                key={client.id}
                                                href={`/clients/${client.id}/pages`}
                                                className="group grid gap-4 border-t border-border px-4 py-4 transition-colors first:border-t-0 hover:bg-primary/4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 md:grid-cols-[52px_minmax(0,1fr)_160px_28px] md:items-center md:px-5"
                                            >
                                                <div className="font-mono text-xs font-semibold text-muted-foreground">
                                                    {(index + 1).toString().padStart(2, '0')}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                                                        {getClientLabel(client)}
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Open page library
                                                    </p>
                                                </div>
                                                <span
                                                    className={cn(
                                                        'inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold',
                                                        active
                                                            ? 'border-primary/20 bg-primary/6 text-primary'
                                                            : 'border-border bg-white text-muted-foreground',
                                                    )}
                                                >
                                                    <span className="size-1.5 rounded-full bg-current" />
                                                    {active ? 'Current focus' : 'Ready'}
                                                </span>
                                                <ArrowRight className="hidden size-4 justify-self-end text-muted-foreground transition-colors group-hover:text-primary md:block" />
                                            </Link>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <aside className="overflow-hidden border border-border bg-white">
                            <CommandStrip label="Current focus" status="Workspace context" />
                            <div className="border-l-2 border-primary bg-primary/4 px-5 py-5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Active client
                                </p>
                                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.055em] text-foreground">
                                    {activeClientLabel}
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    The sidebar keeps this client available while the command center
                                    stays reserved for higher-level admin workflow.
                                </p>
                                {activeClient ? (
                                    <Button
                                        render={<Link href={`/clients/${activeClient.id}/pages`} />}
                                        className="mt-5 gap-2 rounded-none"
                                    >
                                        Open workspace
                                        <ArrowRight className="size-4" />
                                    </Button>
                                ) : null}
                            </div>
                        </aside>

                        <aside className="overflow-hidden border border-border bg-white">
                            <CommandStrip label="Future modules" status="Reserved slots" />
                            <ModuleSlot
                                label="Rollout"
                                title="Deployment and release health"
                                detail="Use this slot for client rollout status, deployment checks, and release notes when those admin surfaces land."
                            />
                            <ModuleSlot
                                label="Activity"
                                title="Client alerts and recent edits"
                                detail="A divided module can show recent publishing activity without competing with the client jump list."
                            />
                        </aside>
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-[1480px] px-5 py-8 md:px-8 md:py-10">
            <section className="max-w-2xl overflow-hidden border border-border bg-white">
                <CommandStrip label="Workspace unavailable" status="No client context" />
                <div className="border-l-2 border-primary bg-primary/4 px-5 py-6 md:px-6">
                    <h1 className="text-2xl font-semibold tracking-[-0.055em] text-foreground">
                        No client selected
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Your account is signed in, but no editable client could be
                        resolved yet.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button
                            onClick={handleSignOut}
                            variant="outline"
                            className="gap-2 rounded-none"
                        >
                            <LogOut className="size-4" />
                            Sign out
                        </Button>
                        <Button
                            onClick={handleSwitchAccount}
                            variant="ghost"
                            className="gap-2 rounded-none"
                        >
                            Try a different account
                            <ArrowRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

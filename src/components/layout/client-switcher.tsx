'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronDown, Search, SquareStack } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useActiveClient } from '@/providers/active-client-provider'
import { useAuth } from '@/providers/auth-provider'
import { cn } from '@/lib/utils'

type ClientSwitcherVariant = 'topbar' | 'sidebar'

const getClientLabel = (
    client: ReturnType<typeof useActiveClient>['activeClient'],
) => {
    if (!client) return 'Select client'

    return (
        client.company_name ||
        [client.firstname, client.lastname].filter(Boolean).join(' ') ||
        'Untitled client'
    )
}

interface ClientSwitcherProps {
    variant?: ClientSwitcherVariant
}

const getTriggerClassName = (variant: ClientSwitcherVariant) =>
    cn(
        'justify-between rounded-none',
        variant === 'sidebar'
            ? 'h-auto min-h-12 w-full border-0 bg-transparent px-1 shadow-none hover:bg-transparent'
            : 'hidden min-w-56 border-border bg-white shadow-none md:flex',
    )

export const ClientSwitcher = ({
    variant = 'topbar',
}: ClientSwitcherProps) => {
    const { isPvsAdmin } = useAuth()
    const { activeClient, availableClients, setActiveClient, isLoading } =
        useActiveClient()
    const [adminOpen, setAdminOpen] = useState(false)
    const [query, setQuery] = useState('')

    const filteredClients = useMemo(() => {
        const normalized = query.trim().toLowerCase()
        if (!normalized) return availableClients

        return availableClients.filter((client) =>
            getClientLabel(client).toLowerCase().includes(normalized),
        )
    }, [availableClients, query])

    if (isLoading || availableClients.length <= 1) {
        return null
    }

    if (isPvsAdmin) {
        return (
            <>
                <Button
                    variant="outline"
                    size="sm"
                    className={getTriggerClassName(variant)}
                    onClick={() => setAdminOpen(true)}
                >
                    <span className="flex min-w-0 items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center border border-border bg-white text-primary">
                            <SquareStack className="size-4" />
                        </span>
                        <span className="min-w-0 text-left">
                            <span className="block truncate text-sm font-semibold">
                                {getClientLabel(activeClient)}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                                Active client
                            </span>
                        </span>
                    </span>
                    <ChevronDown className="size-4 text-muted-foreground" />
                </Button>

                <Dialog
                    open={adminOpen}
                    onOpenChange={setAdminOpen}
                >
                    <DialogContent className="rounded-none sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Switch client</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Search clients..."
                                    className="h-11 w-full rounded-none border border-border bg-background pl-10 pr-3 text-sm outline-none ring-0 transition focus:border-ring"
                                />
                            </div>

                            <div className="max-h-80 overflow-y-auto border border-border bg-[#f8f8f6] p-2">
                                {filteredClients.length === 0 ? (
                                    <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                                        No clients match that search.
                                    </p>
                                ) : (
                                    filteredClients.map((client) => {
                                        const selected = client.id === activeClient?.id

                                        return (
                                            <button
                                                key={client.id}
                                                type="button"
                                                onClick={() => {
                                                    setActiveClient(client.id)
                                                    setAdminOpen(false)
                                                    setQuery('')
                                                }}
                                                className={cn(
                                                    'flex w-full items-center justify-between border-l-2 px-3 py-2 text-left text-sm transition-colors',
                                                    selected
                                                        ? 'border-primary bg-primary/6 text-foreground'
                                                        : 'border-transparent hover:border-primary/40 hover:bg-primary/4',
                                                )}
                                            >
                                                <span className="truncate">
                                                    {getClientLabel(client)}
                                                </span>
                                                {selected && (
                                                    <Check className="size-4 text-primary" />
                                                )}
                                            </button>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="outline"
                        size="sm"
                        className={getTriggerClassName(variant)}
                    />
                }
            >
                <span className="flex min-w-0 items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center border border-border bg-white text-primary">
                        <SquareStack className="size-4" />
                    </span>
                    <span className="min-w-0 text-left">
                        <span className="block truncate text-sm font-semibold">
                            {getClientLabel(activeClient)}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                            Active client
                        </span>
                    </span>
                </span>
                <ChevronDown className="size-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                className="min-w-64 rounded-none"
            >
                {availableClients.map((client) => {
                    const selected = client.id === activeClient?.id

                    return (
                        <DropdownMenuItem
                            key={client.id}
                            onClick={() => setActiveClient(client.id)}
                            className={cn(
                                'justify-between rounded-none border-l-2',
                                selected ? 'border-primary bg-primary/6' : 'border-transparent',
                            )}
                        >
                            <span>{getClientLabel(client)}</span>
                            {selected && (
                                <Check className="size-4 text-primary" />
                            )}
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

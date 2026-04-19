'use client'

import { FileText, Globe, Sparkles } from 'lucide-react'
import { useActiveClient } from '@/providers/active-client-provider'

const getClientLabel = (
    client: ReturnType<typeof useActiveClient>['activeClient'],
) => {
    if (!client) return 'this client'

    return (
        client.company_name ||
        [client.firstname, client.lastname].filter(Boolean).join(' ') ||
        'this client'
    )
}

export default function ClientPagesPage() {
    const { activeClient, activeWebsite } = useActiveClient()
    const clientLabel = getClientLabel(activeClient)

    return (
        <div className="space-y-6 p-6 md:p-8">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-[0_18px_48px_-44px_rgba(17,17,17,0.5)]">
                <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                        <FileText className="size-6" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-primary">
                            Client pages
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {clientLabel}
                        </h1>
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                            The client-aware routing foundation is active. This
                            landing page confirms the selected client context
                            while the rest of the editor surfaces come online.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                        <Globe className="size-4 text-primary" />
                        Active website
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {activeWebsite?.title ||
                            activeWebsite?.domain ||
                            'No website is linked to this assignment yet.'}
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                        <Sparkles className="size-4 text-primary" />
                        Next up
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Templates, settings, submissions, and the page editor
                        can now anchor themselves to the active client URL.
                    </p>
                </div>
            </div>
        </div>
    )
}

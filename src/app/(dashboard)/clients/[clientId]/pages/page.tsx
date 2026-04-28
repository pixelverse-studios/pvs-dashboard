'use client'

import Link from 'next/link'
import {
    ChevronRight,
    CircleDot,
    Command,
    FileText,
    Globe,
    RefreshCw,
    TableOfContents,
    TriangleAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/lib/api-error'
import { useCmsPages } from '@/hooks/use-cms-pages'
import { useActiveClient } from '@/providers/active-client-provider'
import { cn } from '@/lib/utils'
import type { CmsPageListItem } from '@/types/cms-page'

const getErrorMessage = (error: Error) => {
    if (error instanceof ApiError && error.body && typeof error.body === 'object') {
        const message = 'message' in error.body ? error.body.message : null
        if (typeof message === 'string' && message.trim()) {
            return message
        }
    }

    return error.message || 'Something went wrong while loading pages.'
}

const getClientLabel = (
    client: ReturnType<typeof useActiveClient>['activeClient'],
) => {
    if (!client) return 'your website'

    return (
        client.company_name ||
        [client.firstname, client.lastname].filter(Boolean).join(' ') ||
        'your website'
    )
}

const getWebsiteLabel = (
    website: ReturnType<typeof useActiveClient>['activeWebsite'],
) => website?.title || website?.domain || 'Website connection pending'

const getPageLabel = (page: CmsPageListItem) =>
    page.template?.label || page.slug || 'Untitled page'

const getPageRoute = (page: CmsPageListItem) => page.route || `/${page.slug}`

const getStatusLabel = (status: string | null) =>
    status === 'active' ? 'Published' : 'Draft'

const getStatusClassName = (status: string | null) =>
    status === 'active'
        ? 'border-success/20 bg-success/8 text-success'
        : 'border-warning/25 bg-warning/10 text-warning'

const getPublishedCount = (pages: CmsPageListItem[]) =>
    pages.filter((page) => page.status === 'active').length

const formatRelativeTime = (value: string | null) => {
    if (!value) return 'Unknown'

    const timestamp = new Date(value).getTime()
    if (Number.isNaN(timestamp)) return 'Unknown'

    const elapsedSeconds = Math.round((timestamp - Date.now()) / 1000)
    const absSeconds = Math.abs(elapsedSeconds)
    const formatter = new Intl.RelativeTimeFormat('en', {
        numeric: 'auto',
    })

    if (absSeconds < 60) {
        return formatter.format(elapsedSeconds, 'second')
    }

    const elapsedMinutes = Math.round(elapsedSeconds / 60)
    if (Math.abs(elapsedMinutes) < 60) {
        return formatter.format(elapsedMinutes, 'minute')
    }

    const elapsedHours = Math.round(elapsedMinutes / 60)
    if (Math.abs(elapsedHours) < 24) {
        return formatter.format(elapsedHours, 'hour')
    }

    const elapsedDays = Math.round(elapsedHours / 24)
    if (Math.abs(elapsedDays) < 30) {
        return formatter.format(elapsedDays, 'day')
    }

    const elapsedMonths = Math.round(elapsedDays / 30)
    if (Math.abs(elapsedMonths) < 12) {
        return formatter.format(elapsedMonths, 'month')
    }

    return formatter.format(Math.round(elapsedMonths / 12), 'year')
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

const LibraryMetric = ({
    label,
    value,
    tone = 'neutral',
}: {
    label: string
    value: string | number
    tone?: 'neutral' | 'success' | 'warning'
}) => {
    const toneClassName =
        tone === 'success'
            ? 'border-success/20 bg-success/8 text-success'
        : tone === 'warning'
          ? 'border-warning/25 bg-warning/10 text-warning'
          : 'border-border bg-white text-foreground'

    return (
        <div
            className={cn(
                'border-l-2 px-3 py-2',
                tone === 'neutral' ? 'border-border' : 'border-current',
                toneClassName,
            )}
        >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {label}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-[-0.055em] text-foreground">{value}</p>
        </div>
    )
}

const InlineMetrics = ({
    pages,
}: {
    pages: CmsPageListItem[]
}) => {
    const publishedCount = getPublishedCount(pages)

    return (
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
            <LibraryMetric
                label="Total pages"
                value={pages.length}
            />
            <LibraryMetric
                label="Published"
                value={publishedCount}
                tone="success"
            />
            <LibraryMetric
                label="Drafts"
                value={pages.length - publishedCount}
                tone="warning"
            />
        </div>
    )
}

const AtlasIntro = ({
    clientLabel,
    websiteLabel,
    pages,
}: {
    clientLabel: string
    websiteLabel: string
    pages: CmsPageListItem[]
}) => (
    <section className="border border-border bg-white">
        <CommandStrip label="Content library" status="Pages index" />
        <div className="grid gap-7 px-5 py-7 md:px-8 md:py-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <div className="max-w-4xl space-y-5">
                <div className="inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    <CircleDot className="size-3 text-primary" />
                    Pages
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-semibold leading-[0.95] tracking-[-0.075em] text-foreground md:text-6xl">
                        Client page library.
                    </h1>
                    <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                        Scan route, status, and recent changes for {clientLabel} before opening the
                        focused editor.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex max-w-full items-center gap-2 border border-border bg-[#f8f8f6] px-3 py-2 text-sm text-muted-foreground">
                        <Globe className="size-4 text-primary" />
                        <span className="truncate">{websiteLabel}</span>
                    </div>
                </div>
            </div>

            <div className="border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                <InlineMetrics pages={pages} />
            </div>
        </div>
    </section>
)

const PageRowCard = ({
    clientId,
    page,
    index,
}: {
    clientId: string
    page: CmsPageListItem
    index: number
}) => (
    <Link
        href={`/clients/${clientId}/pages/${page.id}`}
        className="group grid gap-4 border-t border-border px-4 py-4 transition-colors hover:bg-primary/4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 md:grid-cols-[52px_minmax(0,1fr)_128px_150px_28px] md:items-center md:px-5"
    >
        <div className="font-mono text-xs font-semibold text-muted-foreground">
            {(index + 1).toString().padStart(2, '0')}
        </div>

        <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                {getPageLabel(page)}
            </p>
            <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                {getPageRoute(page)}
            </p>
        </div>

        <span
            className={cn(
                'inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold',
                getStatusClassName(page.status),
            )}
        >
            <span className="size-1.5 rounded-full bg-current" />
            {getStatusLabel(page.status)}
        </span>

        <div className="text-xs text-muted-foreground">
            <span className="md:hidden">Updated </span>
            {formatRelativeTime(page.updated_at)}
        </div>

        <div className="hidden justify-self-end text-muted-foreground transition-colors group-hover:text-primary md:block">
            <ChevronRight className="size-4" />
        </div>
    </Link>
)

const LoadingState = () => (
    <section className="overflow-hidden border border-border bg-white">
        <CommandStrip label="Content library" status="Loading pages" />
        <div className="grid gap-6 px-5 py-7 md:px-8 md:py-8 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-4">
                <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
                <div className="h-12 w-72 max-w-full animate-pulse rounded-full bg-muted" />
                <div className="h-5 w-full max-w-xl animate-pulse rounded-full bg-muted/80" />
            </div>
            <div className="space-y-2">
                <div className="h-16 animate-pulse bg-muted/70" />
                <div className="h-16 animate-pulse bg-muted/70" />
            </div>
        </div>
        <div className="border-t border-border bg-[#f8f8f6]">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="grid gap-4 border-t border-border px-4 py-4 first:border-t-0 md:grid-cols-[52px_minmax(0,1fr)_128px_150px_28px] md:items-center md:px-5"
                >
                    <div className="h-3 w-5 animate-pulse rounded-full bg-muted" />
                    <div className="space-y-2">
                        <div className="h-4 w-44 animate-pulse rounded-full bg-muted" />
                        <div className="h-3 w-28 animate-pulse rounded-full bg-muted/80" />
                    </div>
                    <div className="h-6 w-20 animate-pulse rounded-md bg-muted" />
                    <div className="h-3 w-24 animate-pulse rounded-full bg-muted/80" />
                    <div className="hidden h-4 w-4 animate-pulse rounded-full bg-muted md:block" />
                </div>
            ))}
        </div>
    </section>
)

const EmptyState = () => (
    <section className="overflow-hidden border border-border bg-white">
        <CommandStrip label="Content library" status="No entries" />
        <div className="px-5 py-14 md:px-8">
            <div className="mx-auto max-w-xl border-l-2 border-primary bg-primary/4 px-5 py-5">
                <FileText className="size-5 text-primary" />
                <h2 className="mt-4 text-lg font-semibold tracking-[-0.04em] text-foreground">
                    No pages yet
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    A PVS admin needs to set up this site&apos;s templates before pages appear in
                    the library.
                </p>
            </div>
        </div>
    </section>
)

const ErrorState = ({
    message,
    onRetry,
}: {
    message: string
    onRetry: () => void
}) => (
    <section className="overflow-hidden border border-destructive/20 bg-white">
        <CommandStrip label="Content library" status="Load failed" />
        <div className="flex flex-col gap-5 border-l-2 border-destructive bg-destructive/6 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-8">
            <div className="flex items-start gap-3">
                <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
                <div>
                    <h2 className="text-base font-semibold text-foreground">Unable to load pages</h2>
                    <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">{message}</p>
                </div>
            </div>

            <Button
                variant="outline"
                className="gap-2 self-start rounded-none md:self-center"
                onClick={onRetry}
            >
                <RefreshCw className="size-4" />
                Retry
            </Button>
        </div>
    </section>
)

const AtlasLayout = ({
    clientLabel,
    websiteLabel,
    clientId,
    pages,
}: {
    clientLabel: string
    websiteLabel: string
    clientId: string
    pages: CmsPageListItem[]
}) => {
    return (
        <div className="space-y-6">
            <AtlasIntro
                clientLabel={clientLabel}
                websiteLabel={websiteLabel}
                pages={pages}
            />

            <section className="overflow-hidden border border-border bg-white">
                <div className="grid gap-5 px-5 py-5 md:grid-cols-[minmax(0,1fr)_140px] md:px-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            <TableOfContents className="size-3.5 text-primary" />
                            Library
                        </div>
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-semibold tracking-[-0.055em] text-foreground">
                                Pages library
                            </h2>
                            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                                Open a row to continue into its editor route.
                            </p>
                        </div>
                    </div>

                    <div className="border-l border-border pl-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Entries
                        </p>
                        <div className="mt-1 flex items-end gap-2">
                            <span className="text-4xl font-semibold tracking-[-0.065em] text-foreground">
                                {pages.length}
                            </span>
                            <span className="pb-1 text-sm text-muted-foreground">total</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border bg-[#f8f8f6]">
                    <div className="hidden gap-4 px-5 py-3 md:grid md:grid-cols-[52px_minmax(0,1fr)_128px_150px_28px]">
                        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            No.
                        </p>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Page and route
                        </p>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Status
                        </p>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Updated
                        </p>
                    </div>

                    <div className="bg-white">
                        {pages.map((page, index) => (
                            <PageRowCard
                                key={page.id}
                                clientId={clientId}
                                page={page}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
export default function ClientPagesPage() {
    const { activeClient, activeWebsite } = useActiveClient()
    const clientId = activeClient?.id ?? null
    const clientLabel = getClientLabel(activeClient)
    const websiteLabel = getWebsiteLabel(activeWebsite)
    const pagesQuery = useCmsPages(clientId)

    return (
        <div className="mx-auto max-w-[1480px] space-y-6 px-5 py-8 md:px-8 md:py-10">
            {pagesQuery.isLoading ? (
                <LoadingState />
            ) : pagesQuery.error ? (
                <ErrorState
                    message={getErrorMessage(pagesQuery.error)}
                    onRetry={() => pagesQuery.refetch()}
                />
            ) : pagesQuery.data && pagesQuery.data.pages.length > 0 && clientId ? (
                <AtlasLayout
                    clientLabel={clientLabel}
                    websiteLabel={websiteLabel}
                    clientId={clientId}
                    pages={pagesQuery.data.pages}
                />
            ) : (
                <EmptyState />
            )}
        </div>
    )
}

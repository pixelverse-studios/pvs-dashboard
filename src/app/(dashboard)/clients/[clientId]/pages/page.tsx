'use client'

import Link from 'next/link'
import {
    ChevronRight,
    FileText,
    Globe,
    RefreshCw,
    Sparkles,
    TableOfContents,
    TriangleAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
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
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-amber-200 bg-amber-50 text-amber-700'

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

const MetricRow = ({
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
            ? 'border-emerald-200 bg-emerald-50/70'
        : tone === 'warning'
          ? 'border-amber-200 bg-amber-50/70'
          : 'border-border/70 bg-[#fbfbfd]'

    return (
        <div
            className={cn(
                'flex items-center justify-between gap-4 rounded-[0.85rem] border px-3.5 py-2.5',
                toneClassName,
            )}
        >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {label}
            </p>
            <p className="text-lg font-semibold tracking-tight text-foreground">
                {value}
            </p>
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
        <div className="space-y-2.5">
            <MetricRow
                label="Total pages"
                value={pages.length}
            />
            <MetricRow
                label="Published"
                value={publishedCount}
                tone="success"
            />
            <MetricRow
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
    <section className="rounded-[1.25rem] border border-border/70 bg-white shadow-[0_24px_60px_-52px_rgba(17,17,17,0.5)]">
        <div className="grid gap-6 px-6 py-6 md:px-8 md:py-7 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
            <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-[#f7f7fb] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                    <Sparkles className="size-3.5" />
                    Content overview
                </div>
                <div className="space-y-3">
                    <h1 className="text-[2.8rem] font-semibold tracking-[-0.07em] text-foreground md:text-[4.2rem]">
                        Pages
                    </h1>
                    <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-[0.95rem]">
                        Review the live editing surface for {clientLabel}. This
                        layout treats the page list like an editorial briefing:
                        orient first, then scan, then act.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white px-3 py-1.5 text-sm font-medium text-foreground">
                        <Globe className="size-4 text-primary" />
                        <span>{websiteLabel}</span>
                    </div>
                </div>
            </div>

            <div className="border-t border-border/70 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
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
        className="group flex items-center justify-between gap-4 rounded-[1rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(252,252,254,0.96))] px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_18px_36px_-30px_rgba(63,0,233,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
        <div
            className="flex size-12 shrink-0 items-center justify-center rounded-[1.05rem] border border-border/70 bg-[#f7f7fb] text-sm font-semibold tracking-tight text-foreground/80 transition-colors group-hover:border-primary/20 group-hover:bg-primary/6 group-hover:text-primary"
        >
            {(index + 1).toString().padStart(2, '0')}
        </div>

        <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                    <p className="truncate text-base font-medium text-foreground transition-colors group-hover:text-primary">
                        {getPageLabel(page)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{page.slug}</p>
                </div>

                <span
                    className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClassName(page.status)}`}
                >
                    {getStatusLabel(page.status)}
                </span>
            </div>

            <div className="mt-4 grid gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground sm:grid-cols-2">
                <div className="flex items-center gap-2">
                    <span>Last updated</span>
                    <span className="text-foreground/70 normal-case tracking-normal">
                        {formatRelativeTime(page.updated_at)}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span>Route</span>
                    <span className="truncate text-foreground/70 normal-case tracking-normal">
                        {getPageRoute(page)}
                    </span>
                </div>
            </div>
        </div>

        <div className="rounded-[0.95rem] border border-border/70 bg-muted/30 p-3 text-muted-foreground transition-all duration-200 group-hover:border-primary/20 group-hover:bg-primary/6 group-hover:text-primary">
            <ChevronRight className="size-4" />
        </div>
    </Link>
)

const LoadingState = () => (
    <Card className="rounded-[1.2rem] border border-border/80 shadow-[0_18px_48px_-44px_rgba(17,17,17,0.5)]">
        <CardHeader className="border-b border-border/70">
            <div className="h-6 w-28 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-72 animate-pulse rounded-full bg-muted/80" />
        </CardHeader>
        <CardContent className="space-y-3 py-4">
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className="rounded-2xl border border-border/70 p-4"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1 space-y-3">
                            <div className="h-5 w-36 animate-pulse rounded-full bg-muted" />
                            <div className="h-4 w-24 animate-pulse rounded-full bg-muted/80" />
                        </div>
                        <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                    </div>
                    <div className="mt-4 h-4 w-32 animate-pulse rounded-full bg-muted/70" />
                </div>
            ))}
        </CardContent>
    </Card>
)

const EmptyState = () => (
    <Card className="rounded-[1.2rem] border border-border/80 shadow-[0_18px_48px_-44px_rgba(17,17,17,0.5)]">
        <CardContent className="flex flex-col items-center px-6 py-14 text-center">
            <div className="mb-4 rounded-2xl bg-primary/10 p-4 text-primary">
                <FileText className="size-6" />
            </div>
            <h2 className="text-lg font-medium text-foreground">No pages yet</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                A PVS admin needs to set up your site templates before pages appear
                here.
            </p>
        </CardContent>
    </Card>
)

const ErrorState = ({
    message,
    onRetry,
}: {
    message: string
    onRetry: () => void
}) => (
    <Card className="rounded-[1.2rem] border border-destructive/20 bg-[linear-gradient(180deg,rgba(255,244,244,0.9),rgba(255,249,249,0.98))] shadow-[0_18px_48px_-44px_rgba(17,17,17,0.5)]">
        <CardContent className="flex flex-col gap-5 px-6 py-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-destructive/10 p-3 text-destructive">
                    <TriangleAlert className="size-5" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-base font-medium text-foreground">
                        Unable to load pages
                    </h2>
                    <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                        {message}
                    </p>
                </div>
            </div>

            <Button
                variant="outline"
                className="gap-2 self-start md:self-center"
                onClick={onRetry}
            >
                <RefreshCw className="size-4" />
                Retry
            </Button>
        </CardContent>
    </Card>
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

            <Card className="overflow-hidden rounded-[1.2rem] border border-border/80 bg-white shadow-[0_18px_48px_-44px_rgba(17,17,17,0.5)]">
                <CardContent className="p-0">
                    <div className="grid gap-6 px-5 py-5 md:grid-cols-[minmax(0,1fr)_140px] md:px-6 md:py-6">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                <TableOfContents className="size-3.5 text-primary" />
                                Library
                            </div>
                            <div className="space-y-1.5">
                                <h2 className="text-[1.4rem] font-semibold tracking-[-0.05em] text-foreground">
                                    Pages library
                                </h2>
                                <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                                    Open a page to continue into its editor route.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-end md:justify-end">
                            <div className="space-y-1 border-l border-border/70 pl-4 md:pl-5">
                                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                    Entries
                                </p>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-semibold tracking-[-0.06em] text-foreground">
                                        {pages.length}
                                    </span>
                                    <span className="pb-1 text-sm text-muted-foreground">
                                        total
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border/70 bg-[#fcfcfe] px-4 py-4 md:px-5 md:py-5">
                        <div className="mb-3 hidden items-center justify-between px-1 md:flex">
                            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                Active pages
                            </p>
                            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                Status and route
                            </p>
                        </div>

                        <div className="space-y-3">
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
                </CardContent>
            </Card>
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
        <div className="space-y-6 p-6 md:p-8">
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

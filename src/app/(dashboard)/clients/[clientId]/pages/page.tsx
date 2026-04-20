'use client'

import Link from 'next/link'
import {
    ChevronRight,
    FileText,
    LayoutTemplate,
    RefreshCw,
    Sparkles,
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

const getPageLabel = (page: CmsPageListItem) =>
    page.template?.label || page.slug || 'Untitled page'

const getStatusLabel = (status: string | null) =>
    status === 'active' ? 'Published' : 'Draft'

const getStatusClassName = (status: string | null) =>
    status === 'active'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-amber-200 bg-amber-50 text-amber-700'

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

const PageHero = ({
    clientLabel,
    pageCount,
}: {
    clientLabel: string
    pageCount: number
}) => (
    <section className="relative overflow-hidden rounded-[1.9rem] border border-border/70 bg-white shadow-[0_24px_60px_-52px_rgba(17,17,17,0.5)]">
        <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(63,0,233,0.18),transparent_58%),radial-gradient(circle_at_top_right,rgba(201,71,255,0.14),transparent_42%)]" />
        <div className="relative flex flex-col gap-8 px-6 py-7 md:px-8 md:py-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-[#f7f7fb] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                    <Sparkles className="size-3.5" />
                    Content overview
                </div>
                <div className="space-y-3">
                    <h1 className="text-4xl font-semibold tracking-[-0.06em] text-foreground md:text-5xl">
                        Pages
                    </h1>
                    <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-[0.95rem]">
                        Review the live editing surface for {clientLabel}. This is
                        the fastest way to see what content exists, what is still in
                        draft, and where to jump next.
                    </p>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
                <div className="rounded-[1.45rem] border border-border/70 bg-[#fbfbfd] p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <FileText className="size-4 text-primary" />
                        Total pages
                    </div>
                    <p className="text-3xl font-semibold tracking-tight text-foreground">
                        {pageCount}
                    </p>
                </div>

                <div className="rounded-[1.45rem] border border-border/70 bg-[#fbfbfd] p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <LayoutTemplate className="size-4 text-primary" />
                        Workflow
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                        Open any page to continue into the editor path for this
                        client workspace.
                    </p>
                </div>
            </div>
        </div>
    </section>
)

const LoadingState = () => (
    <Card className="rounded-[1.75rem] border border-border/80 shadow-[0_18px_48px_-44px_rgba(17,17,17,0.5)]">
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
    <Card className="rounded-[1.75rem] border border-border/80 shadow-[0_18px_48px_-44px_rgba(17,17,17,0.5)]">
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
    <Card className="rounded-[1.75rem] border border-destructive/20 bg-[linear-gradient(180deg,rgba(255,244,244,0.9),rgba(255,249,249,0.98))] shadow-[0_18px_48px_-44px_rgba(17,17,17,0.5)]">
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

const PagesList = ({
    clientId,
    pages,
}: {
    clientId: string
    pages: CmsPageListItem[]
}) => (
    <Card className="rounded-[1.75rem] border border-border/80 shadow-[0_18px_48px_-44px_rgba(17,17,17,0.5)]">
        <CardHeader className="border-b border-border/70 bg-[linear-gradient(180deg,rgba(252,252,254,0.96),rgba(255,255,255,1))]">
            <CardTitle>Pages</CardTitle>
            <CardDescription>
                Edit the content that appears on your website.
            </CardDescription>
        </CardHeader>

        <CardContent className="py-3">
            <div className="space-y-3">
                {pages.map((page) => (
                    <Link
                        key={page.id}
                        href={`/clients/${clientId}/pages/${page.id}`}
                        className="group flex items-center justify-between gap-4 rounded-[1.45rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(252,252,254,0.96))] px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_18px_36px_-30px_rgba(63,0,233,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="min-w-0">
                                    <p className="truncate text-base font-medium text-foreground transition-colors group-hover:text-primary">
                                        {getPageLabel(page)}
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {page.slug}
                                    </p>
                                </div>

                                <span
                                    className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClassName(page.status)}`}
                                >
                                    {getStatusLabel(page.status)}
                                </span>
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                <span>Last updated</span>
                                <span className="text-foreground/70 normal-case tracking-normal">
                                    {formatRelativeTime(page.updated_at)}
                                </span>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border/70 bg-muted/30 p-3 text-muted-foreground transition-all duration-200 group-hover:border-primary/20 group-hover:bg-primary/6 group-hover:text-primary">
                            <ChevronRight className="size-4" />
                        </div>
                    </Link>
                ))}
            </div>
        </CardContent>
    </Card>
)

export default function ClientPagesPage() {
    const { activeClient } = useActiveClient()
    const clientId = activeClient?.id ?? null
    const clientLabel = getClientLabel(activeClient)
    const pagesQuery = useCmsPages(clientId)
    const pageCount = pagesQuery.data?.pages.length ?? 0

    return (
        <div className="space-y-6 p-6 md:p-8">
            <PageHero
                clientLabel={clientLabel}
                pageCount={pageCount}
            />

            {pagesQuery.isLoading ? (
                <LoadingState />
            ) : pagesQuery.error ? (
                <ErrorState
                    message={getErrorMessage(pagesQuery.error)}
                    onRetry={() => pagesQuery.refetch()}
                />
            ) : pagesQuery.data && pagesQuery.data.pages.length > 0 && clientId ? (
                <PagesList
                    clientId={clientId}
                    pages={pagesQuery.data.pages}
                />
            ) : (
                <EmptyState />
            )}
        </div>
    )
}

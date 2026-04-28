import { Command } from 'lucide-react'

export const FullScreenLoader = () => (
    <div className="flex h-screen items-center justify-center bg-[#f8f8f6] px-5">
        <div className="w-full max-w-[520px] overflow-hidden border border-border bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-border bg-white/90 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Command className="size-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">PVS CMS</p>
                        <p className="text-xs text-muted-foreground">Loading workspace</p>
                    </div>
                </div>
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[58%] animate-pulse rounded-full bg-primary" />
                </div>
            </div>
            <div className="space-y-5 px-5 py-6">
                <div className="space-y-3">
                    <div className="h-3 w-24 animate-pulse bg-primary/20" />
                    <div className="h-8 w-3/4 animate-pulse bg-muted" />
                    <div className="h-3 w-full animate-pulse bg-muted" />
                    <div className="h-3 w-2/3 animate-pulse bg-muted" />
                </div>
                <div className="grid gap-3 border-t border-border pt-5">
                    <div className="h-10 animate-pulse bg-muted/70" />
                    <div className="h-10 animate-pulse bg-muted/45" />
                </div>
            </div>
        </div>
    </div>
)

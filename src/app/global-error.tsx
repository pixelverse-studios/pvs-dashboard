'use client'

import { useEffect } from 'react'
import { Command, RotateCcw, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error('Global error:', error)
    }, [error])

    return (
        <html lang="en">
            <body className="min-h-screen bg-[#f8f8f6] font-sans antialiased">
                <div className="flex min-h-screen items-center justify-center px-5 py-8">
                    <div className="w-full max-w-[680px] overflow-hidden border border-border bg-white">
                        <div className="flex items-center justify-between gap-4 border-b border-border bg-white/90 px-4 py-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-foreground">
                                        PVS CMS
                                    </p>
                                    <p className="text-xs text-muted-foreground">System state</p>
                                </div>
                            </div>
                            <p className="font-mono text-xs font-semibold text-destructive">
                                Error
                            </p>
                        </div>

                        <div className="space-y-6 px-5 py-7 md:px-8 md:py-8">
                            <div className="inline-flex items-center gap-2 border-l-2 border-destructive pl-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                <TriangleAlert className="size-3.5 text-destructive" />
                                Recovery required
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-4xl font-semibold leading-[0.95] tracking-[-0.075em] text-foreground md:text-5xl">
                                    Something went wrong
                                </h1>
                                <p className="max-w-md text-sm leading-7 text-muted-foreground">
                                    The CMS hit an unexpected error. Try again, then contact support
                                    if the problem continues.
                                </p>
                            </div>
                            <Button onClick={reset} className="cursor-pointer gap-2 rounded-none">
                                <RotateCcw className="size-4" />
                                Try again
                            </Button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}

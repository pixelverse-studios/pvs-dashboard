import Link from 'next/link'
import { ArrowLeft, Command, FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-5 py-8">
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
                            <p className="text-xs text-muted-foreground">Route check</p>
                        </div>
                    </div>
                    <p className="font-mono text-xs font-semibold text-muted-foreground">404</p>
                </div>

                <div className="space-y-6 px-5 py-7 md:px-8 md:py-8">
                    <div className="inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        <FileQuestion className="size-3.5 text-primary" />
                        Not found
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-4xl font-semibold leading-[0.95] tracking-[-0.075em] text-foreground md:text-5xl">
                            Page not found
                        </h1>
                        <p className="max-w-md text-sm leading-7 text-muted-foreground">
                            This CMS route does not exist or is no longer available.
                        </p>
                    </div>
                    <Button
                        render={<Link href="/" />}
                        className="cursor-pointer gap-2 rounded-none"
                    >
                        <ArrowLeft className="size-4" />
                        Back to dashboard
                    </Button>
                </div>
            </div>
        </div>
    )
}

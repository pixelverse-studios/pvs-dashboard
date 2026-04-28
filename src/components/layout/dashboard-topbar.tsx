'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Command, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet'
import { useBranding } from '@/providers/branding-provider'
import { SidebarContent } from './dashboard-sidebar'

const isValidLogoUrl = (url: string) => {
    try {
        return new URL(url).protocol === 'https:'
    } catch {
        return false
    }
}

export const DashboardTopbar = () => {
    const [sheetOpen, setSheetOpen] = useState(false)
    const { shellWebsite } = useBranding()
    const logoUrl = shellWebsite?.branding?.logo_url
    const clientName =
        shellWebsite?.client.company_name ||
        [shellWebsite?.client.firstname, shellWebsite?.client.lastname]
            .filter(Boolean)
            .join(' ') ||
        shellWebsite?.website_title ||
        'PixelVerse Studios'

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white/92 px-4 backdrop-blur md:hidden">
            <div className="flex items-center gap-3">
                <Sheet
                    open={sheetOpen}
                    onOpenChange={setSheetOpen}
                >
                    <SheetTrigger
                        render={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-none border border-border bg-[#f8f8f6] md:hidden"
                                aria-label="Open menu"
                            />
                        }
                    >
                        <Menu className="size-5" />
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="w-80 max-w-[86vw] gap-0 border-border bg-white p-0"
                    >
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Command className="size-4" />
                    </div>
                    {logoUrl && isValidLogoUrl(logoUrl) ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={logoUrl}
                            alt={clientName}
                            className="h-7 w-auto max-w-[132px] object-contain"
                        />
                    ) : (
                        <Image
                            src="/pvs-logo.svg"
                            alt="PixelVerse Studios"
                            width={124}
                            height={26}
                            priority
                        />
                    )}
                </div>
            </div>
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[62%] rounded-full bg-primary" />
            </div>
        </header>
    )
}

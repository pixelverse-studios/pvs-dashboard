'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet'
import { SidebarContent } from './dashboard-sidebar'

export const DashboardTopbar = () => {
    const [sheetOpen, setSheetOpen] = useState(false)

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/80 bg-white/90 px-4 backdrop-blur md:hidden">
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
                                className="md:hidden"
                                aria-label="Open menu"
                            />
                        }
                    >
                        <Menu className="size-5" />
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="w-64 p-0"
                    >
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
                <Image
                    src="/pvs-logo.svg"
                    alt="PixelVerse Studios"
                    width={124}
                    height={26}
                    priority
                />
            </div>
        </header>
    )
}

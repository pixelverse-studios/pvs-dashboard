'use client'

import { useState } from 'react'
import { LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet'
import { useAuth } from '@/providers/auth-provider'
import { signOut } from '@/lib/auth-service'
import { SidebarContent } from './dashboard-sidebar'
import { ClientSwitcher } from './client-switcher'

const getInitials = (email: string) => {
    if (!email) return '?'
    return email.slice(0, 2).toUpperCase()
}

export const DashboardTopbar = () => {
    const { session } = useAuth()
    const email = session?.user?.email ?? ''
    const [sheetOpen, setSheetOpen] = useState(false)

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2">
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
                <ClientSwitcher />
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button
                            variant="ghost"
                            className="gap-2 px-2"
                        />
                    }
                >
                    <Avatar className="size-7">
                        <AvatarFallback className="text-xs">
                            {getInitials(email)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm sm:inline">
                        {email}
                    </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="font-normal">
                        {email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                        <LogOut className="mr-2 size-4" />
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}

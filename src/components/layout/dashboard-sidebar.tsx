'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
    ChevronDown,
    CircleDot,
    FileText,
    LayoutTemplate,
    LogOut,
    Palette,
    PanelsTopLeft,
    Users,
    Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/auth-provider'
import { useBranding } from '@/providers/branding-provider'
import { useActiveClient } from '@/providers/active-client-provider'
import { ClientSwitcher } from './client-switcher'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth-service'

interface NavItem {
    label: string
    href: (clientId?: string) => string
    icon: React.ComponentType<{ className?: string }>
    adminOnly?: boolean
    requiresClient?: boolean
}

const navItems: NavItem[] = [
    { label: 'Pages', href: (clientId) => `/clients/${clientId}/pages`, icon: FileText },
    {
        label: 'Elements',
        href: () => '/component-polish',
        icon: Palette,
        adminOnly: true,
        requiresClient: false,
    },
    {
        label: 'Templates',
        href: (clientId) => `/clients/${clientId}/templates`,
        icon: LayoutTemplate,
        adminOnly: true,
    },
    {
        label: 'Users',
        href: (clientId) => `/clients/${clientId}/users`,
        icon: Users,
        adminOnly: true,
    },
    { label: 'Settings', href: (clientId) => `/clients/${clientId}/settings`, icon: Settings },
]

const getClientName = (
    website: ReturnType<typeof useBranding>['website'],
) => {
    if (!website) return 'CMS Dashboard'
    const { client, website_title } = website
    return (
        client.company_name ||
        [client.firstname, client.lastname]
            .filter(Boolean)
            .join(' ') ||
        website_title ||
        'CMS Dashboard'
    )
}

const isValidLogoUrl = (url: string) => {
    try {
        return new URL(url).protocol === 'https:'
    } catch {
        return false
    }
}

const isNavActive = (pathname: string, href: string) =>
    pathname === href || pathname.startsWith(href + '/')

const getInitials = (email: string) => {
    if (!email) return '?'
    return email.slice(0, 2).toUpperCase()
}

const CommandStrip = ({
    label,
    status,
}: {
    label: string
    status: string
}) => (
    <div className="border-b border-border bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <PanelsTopLeft className="size-4" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                        {label}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                        {status}
                    </p>
                </div>
            </div>
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[62%] rounded-full bg-primary" />
            </div>
        </div>
    </div>
)

export const SidebarContent = () => {
    const pathname = usePathname()
    const { isPvsAdmin, session } = useAuth()
    const { shellWebsite } = useBranding()
    const { activeClient } = useActiveClient()
    const clientName = getClientName(shellWebsite)
    const logoUrl = shellWebsite?.branding?.logo_url
    const email = session?.user?.email ?? ''

    const visibleItems = navItems.filter(
        (item) => !item.adminOnly || isPvsAdmin,
    )

    const workspaceStatus = isPvsAdmin ? 'Admin workspace' : 'Client workspace'

    return (
        <div className="flex h-full flex-col bg-white">
            <CommandStrip
                label={isPvsAdmin ? 'PVS CMS' : clientName}
                status={workspaceStatus}
            />

            {isPvsAdmin ? (
                <div className="border-b border-border px-4 py-4">
                    <div className="border border-border bg-[#f8f8f6] px-3 py-3">
                        <ClientSwitcher variant="sidebar" />
                    </div>
                </div>
            ) : (
                <div className="border-b border-border px-4 py-5">
                    <div className="flex items-center gap-3 border-l-2 border-primary/70 px-3 py-2">
                        {logoUrl && isValidLogoUrl(logoUrl) ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={logoUrl}
                                alt={clientName}
                                className="h-8 w-auto max-w-[160px] object-contain"
                            />
                        ) : (
                            <Image
                                src="/pvs-logo.svg"
                                alt="PixelVerse Studios"
                                width={140}
                                height={28}
                                priority
                            />
                        )}
                    </div>
                </div>
            )}

            <nav className="flex-1 space-y-1 px-3 py-4">
                {isPvsAdmin && (
                    <Link
                        href="/"
                        className={cn(
                            'group relative mb-2 flex items-center gap-3 border-l-2 px-3.5 py-3 text-sm font-semibold transition-colors duration-200 ease-out',
                            pathname === '/'
                                ? 'border-primary bg-primary/6 text-foreground'
                                : 'border-transparent text-muted-foreground hover:border-primary/40 hover:bg-primary/4 hover:text-foreground',
                        )}
                    >
                        <PanelsTopLeft className="size-4" />
                        <span>Command center</span>
                        {pathname === '/' ? (
                            <CircleDot className="ml-auto size-3 text-primary" />
                        ) : null}
                    </Link>
                )}

                {visibleItems.map((item) => {
                    const requiresClient = item.requiresClient ?? true
                    const href =
                        requiresClient && !activeClient
                            ? null
                            : item.href(activeClient?.id)
                    const active = href
                        ? isNavActive(pathname, href)
                        : false

                    const itemClassName = cn(
                        'group relative flex items-center gap-3 border-l-2',
                        'px-3.5 py-3 text-sm font-semibold',
                        'transition-colors duration-200 ease-out',
                        active
                            ? 'border-primary bg-primary/6 text-foreground'
                            : 'border-transparent text-muted-foreground',
                        !active &&
                            'hover:border-primary/40 hover:bg-primary/4 hover:text-foreground',
                        !href && 'cursor-not-allowed opacity-50',
                    )

                    if (!href) {
                        return (
                            <div
                                key={item.label}
                                className={itemClassName}
                                aria-disabled="true"
                            >
                                <item.icon className="size-4" />
                                <span>{item.label}</span>
                                {active ? (
                                    <CircleDot className="ml-auto size-3 text-primary" />
                                ) : null}
                            </div>
                        )
                    }

                    return (
                        <Link
                            key={item.label}
                            href={href}
                            className={itemClassName}
                        >
                            <item.icon className="size-4" />
                            <span>{item.label}</span>
                            {active ? (
                                <CircleDot className="ml-auto size-3 text-primary" />
                            ) : null}
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t border-border px-4 py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button
                                variant="ghost"
                                className="h-auto w-full justify-between rounded-none border border-border bg-[#f8f8f6] px-3 py-3 shadow-none hover:bg-primary/4"
                            />
                        }
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <Avatar className="size-9 shrink-0 border border-border/70">
                                <AvatarFallback className="text-xs">
                                    {getInitials(email)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 text-left">
                                <p className="truncate text-sm font-medium text-foreground">
                                    {email || 'Account'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    PixelVerse Studios
                                </p>
                            </div>
                        </div>
                        <ChevronDown className="size-4 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="top" className="w-64 rounded-none">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="font-normal">
                                {email}
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()}>
                            <LogOut className="mr-2 size-4" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {!(logoUrl && isValidLogoUrl(logoUrl)) && (
                    <p className="mt-3 border-l-2 border-border pl-3 text-xs text-muted-foreground">
                        Powered by PixelVerse Studios
                    </p>
                )}
            </div>
        </div>
    )
}

export const DashboardSidebar = () => (
    <aside className="hidden w-80 shrink-0 border-r border-border bg-white md:block">
        <SidebarContent />
    </aside>
)

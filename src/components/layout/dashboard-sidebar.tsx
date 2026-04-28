'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
    ChevronDown,
    FileText,
    LayoutTemplate,
    LogOut,
    Palette,
    PanelsTopLeft,
    Sparkles,
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
    href: (clientId: string) => string
    icon: React.ComponentType<{ className?: string }>
    adminOnly?: boolean
}

const navItems: NavItem[] = [
    { label: 'Pages', href: (clientId) => `/clients/${clientId}/pages`, icon: FileText },
    {
        label: 'Elements',
        href: () => '/component-polish',
        icon: Palette,
        adminOnly: true,
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

export const SidebarContent = () => {
    const pathname = usePathname()
    const { isPvsAdmin, session } = useAuth()
    const { shellWebsite } = useBranding()
    const { activeClient } = useActiveClient()
    const isCommandCenter = pathname === '/'
    const clientName = getClientName(shellWebsite)
    const logoUrl = shellWebsite?.branding?.logo_url
    const email = session?.user?.email ?? ''

    const visibleItems = navItems.filter(
        (item) => !item.adminOnly || isPvsAdmin,
    )

    return (
        <div className="flex h-full flex-col bg-[linear-gradient(180deg,#fff_0%,#f8f7ff_100%)]">
            <div className="border-b border-border/80 px-4 py-5">
                {isPvsAdmin ? (
                    <Link
                        href="/"
                        className="block rounded-[1.35rem] transition-colors hover:bg-primary/4"
                    >
                        <div className="flex items-center gap-3 px-3 py-3">
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
                    </Link>
                ) : (
                    <div className="flex items-center gap-3">
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
                )}

                {isPvsAdmin && (
                    <div className="mt-5 space-y-3">
                        {isCommandCenter && (
                            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-[#f7f7fb] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
                                <Sparkles className="size-3.5" />
                                Admin shell
                            </div>
                        )}
                        <div className="rounded-[1.35rem] border border-border/70 bg-white px-3 py-3 shadow-[0_16px_36px_-32px_rgba(17,17,17,0.28)]">
                            <ClientSwitcher variant="sidebar" />
                        </div>
                    </div>
                )}
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
                {isPvsAdmin && (
                    <Link
                        href="/"
                        className={cn(
                            'mb-2 flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-sm font-medium transition-[background-color,border-color,color,box-shadow] duration-200 ease-out',
                            pathname === '/'
                                ? 'border-primary/40 bg-[linear-gradient(135deg,rgba(63,0,233,0.92),rgba(89,40,255,0.96))] text-primary-foreground shadow-[0_16px_34px_-24px_rgba(63,0,233,0.8)]'
                                : 'border-transparent bg-transparent text-muted-foreground hover:border-primary/12 hover:bg-primary/6 hover:text-foreground hover:shadow-[0_14px_24px_-22px_rgba(63,0,233,0.22)]',
                        )}
                    >
                        <PanelsTopLeft className="size-4" />
                        <span>Command center</span>
                    </Link>
                )}

                {visibleItems.map((item) => {
                    const href = activeClient ? item.href(activeClient.id) : null
                    const active = href
                        ? isNavActive(pathname, href)
                        : false

                    const itemClassName = cn(
                        'flex items-center gap-3 rounded-2xl',
                        'px-3.5 py-3 text-sm font-medium',
                        'border transition-[background-color,border-color,color,box-shadow] duration-200 ease-out',
                        active
                            ? 'border-primary/40 bg-[linear-gradient(135deg,rgba(63,0,233,0.92),rgba(89,40,255,0.96))] text-primary-foreground shadow-[0_16px_34px_-24px_rgba(63,0,233,0.8)]'
                            : 'border-transparent bg-transparent text-muted-foreground',
                        !active &&
                            'hover:border-primary/12 hover:bg-primary/6 hover:text-foreground hover:shadow-[0_14px_24px_-22px_rgba(63,0,233,0.22)]',
                        !activeClient && 'cursor-not-allowed opacity-50',
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
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t border-border/80 px-4 py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button
                                variant="ghost"
                                className="h-auto w-full justify-between rounded-[1.25rem] border border-border/70 bg-white/85 px-3 py-3 shadow-sm"
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
                    <DropdownMenuContent
                        align="end"
                        side="top"
                        className="w-64"
                    >
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
                    <p className="mt-3 text-xs text-muted-foreground">
                        Powered by PixelVerse Studios
                    </p>
                )}
            </div>
        </div>
    )
}

export const DashboardSidebar = () => (
    <aside className="hidden w-80 shrink-0 border-r border-border/80 bg-card md:block">
        <SidebarContent />
    </aside>
)

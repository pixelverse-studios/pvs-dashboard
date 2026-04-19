'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
    FileText,
    LayoutTemplate,
    Users,
    Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/auth-provider'
import { useBranding } from '@/providers/branding-provider'
import { useActiveClient } from '@/providers/active-client-provider'

interface NavItem {
    label: string
    href: (clientId: string) => string
    icon: React.ComponentType<{ className?: string }>
    adminOnly?: boolean
}

const navItems: NavItem[] = [
    { label: 'Pages', href: (clientId) => `/clients/${clientId}/pages`, icon: FileText },
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

export const SidebarContent = () => {
    const pathname = usePathname()
    const { isPvsAdmin } = useAuth()
    const { shellWebsite } = useBranding()
    const { activeClient } = useActiveClient()
    const clientName = getClientName(shellWebsite)
    const logoUrl = shellWebsite?.branding?.logo_url

    const visibleItems = navItems.filter(
        (item) => !item.adminOnly || isPvsAdmin,
    )

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 border-b border-border px-4 py-5">
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

            <nav className="flex-1 space-y-1 px-3 py-4">
                {visibleItems.map((item) => {
                    const href = activeClient ? item.href(activeClient.id) : '#'
                    const active = isNavActive(pathname, href)
                    return (
                        <Link
                            key={item.label}
                            href={href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg',
                                'px-3 py-2 text-sm font-medium',
                                'transition-colors',
                                active
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-muted-foreground',
                                !active &&
                                    'hover:bg-muted hover:text-foreground',
                                !activeClient && 'pointer-events-none opacity-50',
                            )}
                        >
                            <item.icon className="size-4" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {!(logoUrl && isValidLogoUrl(logoUrl)) && (
                <div className="border-t border-border px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                        Powered by PixelVerse Studios
                    </p>
                </div>
            )}
        </div>
    )
}

export const DashboardSidebar = () => (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:block">
        <SidebarContent />
    </aside>
)

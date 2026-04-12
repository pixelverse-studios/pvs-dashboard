'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FileText, LayoutTemplate, Users, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/auth-provider'
import { useBranding } from '@/providers/branding-provider'

interface NavItem {
    label: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    adminOnly?: boolean
}

const navItems: NavItem[] = [
    { label: 'Pages', href: '/pages', icon: FileText },
    { label: 'Templates', href: '/templates', icon: LayoutTemplate, adminOnly: true },
    { label: 'Users', href: '/users', icon: Users, adminOnly: true },
    { label: 'Settings', href: '/settings', icon: Settings },
]

const getClientName = (website: ReturnType<typeof useBranding>['website']) => {
    if (!website) return 'CMS Dashboard'
    const { client, website_title } = website
    return (
        client.company_name ||
        [client.firstname, client.lastname].filter(Boolean).join(' ') ||
        website_title ||
        'CMS Dashboard'
    )
}

export const SidebarContent = () => {
    const pathname = usePathname()
    const { isPvsAdmin } = useAuth()
    const { website } = useBranding()
    const clientName = getClientName(website)

    const visibleItems = navItems.filter(
        (item) => !item.adminOnly || isPvsAdmin,
    )

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 border-b border-border px-4 py-5">
                {website?.branding?.logo_url ? (
                    <img
                        src={website.branding.logo_url}
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
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                            )}
                        >
                            <item.icon className="size-4" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {!website?.branding?.logo_url && (
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

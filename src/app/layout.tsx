import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Geist_Mono } from 'next/font/google'
import { QueryProvider } from '@/providers/query-provider'
import { BrandingProvider } from '@/providers/branding-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
    display: 'swap',
})

export const metadata: Metadata = {
    title: {
        default: 'CMS Dashboard',
        template: '%s · CMS Dashboard',
    },
    description: 'Content management dashboard',
    icons: {
        icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
            className={`${inter.variable} ${geistMono.variable}`}
        >
            <body className="min-h-screen bg-background font-sans antialiased">
                <QueryProvider>
                    <BrandingProvider>
                        <AuthProvider>
                            {children}
                            <Toaster
                                position="top-right"
                                richColors
                            />
                        </AuthProvider>
                    </BrandingProvider>
                </QueryProvider>
            </body>
        </html>
    )
}

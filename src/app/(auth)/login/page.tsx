'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Command, Globe2, ShieldCheck, TriangleAlert } from 'lucide-react'
import { useAuth } from '@/providers/auth-provider'
import { useBranding } from '@/providers/branding-provider'
import { signInWithGoogle } from '@/lib/auth-service'
import { Button } from '@/components/ui/button'
import { FullScreenLoader } from '@/components/full-screen-loader'
import { GoogleIcon } from '@/components/icons/google'

const isValidLogoUrl = (url: string) => {
    try {
        return new URL(url).protocol === 'https:'
    } catch {
        return false
    }
}

function CommandStrip({ label, status }: { label: string; status: string }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-border bg-white/90 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Command className="size-4" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{status}</p>
                </div>
            </div>
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[58%] rounded-full bg-primary" />
            </div>
        </div>
    )
}

export default function LoginPage() {
    const router = useRouter()
    const { isAuthenticated, hasAnyAccess, isLoadingSession, isLoadingMe } = useAuth()
    const { website, isResolved, shouldResolveHostname } = useBranding()
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isLoading = isLoadingSession || isLoadingMe || !isResolved

    useEffect(() => {
        if (!isLoading && isAuthenticated && hasAnyAccess) {
            router.replace('/')
        }
    }, [isLoading, isAuthenticated, hasAnyAccess, router])

    if (isLoading) {
        return <FullScreenLoader />
    }

    const clientName =
        website?.client.company_name ||
        [website?.client.firstname, website?.client.lastname].filter(Boolean).join(' ') ||
        website?.website_title ||
        'PixelVerse Studios'

    const logoUrl = website?.branding?.logo_url

    const handleSignIn = async () => {
        try {
            setIsSigningIn(true)
            setError(null)
            await signInWithGoogle()
        } catch (err) {
            setIsSigningIn(false)
            setError(err instanceof Error ? err.message : 'Sign-in failed. Please try again.')
        }
    }

    return (
        <div className="w-full max-w-[880px] animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="grid overflow-hidden border border-border bg-white lg:grid-cols-[minmax(0,0.58fr)_minmax(320px,0.42fr)]">
                <section className="border-b border-border lg:border-b-0 lg:border-r">
                    <CommandStrip label="PVS CMS" status="Secure dashboard access" />

                    <div className="space-y-8 px-5 py-7 md:px-8 md:py-9">
                        <div className="space-y-5">
                            {logoUrl && isValidLogoUrl(logoUrl) ? (
                                <div className="h-12">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={logoUrl}
                                        alt={`${clientName} logo`}
                                        className="h-full w-auto max-w-full object-contain"
                                    />
                                </div>
                            ) : (
                                <Image
                                    src="/pvs-logo.svg"
                                    alt="PixelVerse Studios"
                                    width={150}
                                    height={30}
                                    priority
                                />
                            )}

                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    <ShieldCheck className="size-3.5 text-primary" />
                                    Admin sign in
                                </div>
                                <h1 className="text-4xl font-semibold leading-[0.95] tracking-[-0.075em] text-foreground md:text-5xl">
                                    Welcome back
                                </h1>
                                <p className="max-w-md text-sm leading-7 text-muted-foreground">
                                    Sign in to manage the {clientName} CMS workspace.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={handleSignIn}
                                disabled={isSigningIn}
                                variant="outline"
                                size="lg"
                                className="h-11 w-full cursor-pointer gap-3 rounded-none border-border bg-white shadow-none hover:border-primary/30 hover:bg-muted/35"
                            >
                                <GoogleIcon className="size-5" />
                                {isSigningIn ? 'Redirecting' : 'Sign in with Google'}
                            </Button>

                            {error ? (
                                <div className="border-l-2 border-destructive bg-destructive/6 px-4 py-3 text-sm font-medium text-destructive">
                                    {error}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </section>

                <aside className="bg-[#f8f8f6] px-5 py-6 md:px-6">
                    <div className="space-y-4">
                        <div className="border-l-2 border-primary bg-primary/4 px-4 py-3">
                            <p className="text-sm font-semibold text-foreground">Workspace</p>
                            <p className="mt-1 text-sm text-muted-foreground">{clientName}</p>
                        </div>

                        <div className="border border-border bg-white px-4 py-4">
                            <div className="flex items-start gap-3">
                                <Globe2 className="mt-0.5 size-4 text-primary" />
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Branded client context
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        This sign-in resolves the workspace from the current domain.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {shouldResolveHostname && website === null ? (
                            <div className="border-l-2 border-warning bg-warning/8 px-4 py-3">
                                <div className="flex items-start gap-3">
                                    <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
                                    <p className="text-sm leading-6 text-muted-foreground">
                                        This domain is not configured yet. Contact PixelVerse
                                        Studios if this looks wrong.
                                    </p>
                                </div>
                            </div>
                        ) : null}

                        <p className="border-t border-border pt-4 text-xs text-muted-foreground">
                            Secured by Google OAuth. Powered by PixelVerse Studios.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    )
}

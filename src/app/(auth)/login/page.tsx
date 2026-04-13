'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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

export default function LoginPage() {
    const router = useRouter()
    const {
        isAuthenticated,
        hasAnyAccess,
        isLoadingSession,
        isLoadingMe,
    } = useAuth()
    const { website, isResolved } = useBranding()
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
        [website?.client.firstname, website?.client.lastname]
            .filter(Boolean)
            .join(' ') ||
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
            setError(
                err instanceof Error
                    ? err.message
                    : 'Sign-in failed. Please try again.',
            )
        }
    }

    return (
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 lg:hidden">
                <div className="mb-6 flex justify-center">
                    <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10">
                        <span className="text-lg font-bold text-primary">
                            P
                        </span>
                    </div>
                </div>
            </div>

            <div className="mb-8 text-center lg:text-left">
                {logoUrl && isValidLogoUrl(logoUrl) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={logoUrl}
                        alt={`${clientName} logo`}
                        className="mx-auto mb-6 h-10 object-contain lg:mx-0"
                    />
                ) : (
                    <Image
                        src="/pvs-logo.svg"
                        alt="PixelVerse Studios"
                        width={140}
                        height={28}
                        className="mx-auto mb-6 lg:mx-0"
                        priority
                    />
                )}
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Welcome back
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Sign in to access the {clientName} dashboard.
                </p>
            </div>

            <div className="space-y-4">
                <Button
                    onClick={handleSignIn}
                    disabled={isSigningIn}
                    variant="outline"
                    className="group h-12 w-full cursor-pointer rounded-xl text-sm font-medium shadow-md ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-primary/20"
                    size="lg"
                >
                    <GoogleIcon className="mr-3 size-5 transition-transform group-hover:scale-110" />
                    {isSigningIn
                        ? 'Redirecting...'
                        : 'Sign in with Google'}
                </Button>

                {error && (
                    <div className="animate-in fade-in slide-in-from-top-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">
                        {error}
                    </div>
                )}
            </div>

            {website === null && (
                <div className="mt-6 rounded-lg border border-warning/20 bg-warning/5 px-4 py-3 text-center text-xs text-muted-foreground">
                    This dashboard isn&apos;t configured for your
                    domain yet. Contact PixelVerse Studios if you
                    believe this is an error.
                </div>
            )}

            <p className="mt-8 text-center text-xs text-muted-foreground/60">
                Secured by Google OAuth &middot; Powered by
                PixelVerse Studios
            </p>
        </div>
    )
}

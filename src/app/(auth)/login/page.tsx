'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/providers/auth-provider'
import { useBranding } from '@/providers/branding-provider'
import { signInWithGoogle } from '@/lib/auth-service'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
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
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                {logoUrl && isValidLogoUrl(logoUrl) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={logoUrl}
                        alt={`${clientName} logo`}
                        className="mx-auto mb-4 h-12 object-contain"
                    />
                ) : (
                    <Image
                        src="/pvs-logo.svg"
                        alt="PixelVerse Studios"
                        width={160}
                        height={32}
                        className="mx-auto mb-4"
                        priority
                    />
                )}
                <CardTitle>
                    Sign in to {clientName}
                </CardTitle>
                <CardDescription>
                    Use your Google account to access your
                    content management dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button
                    onClick={handleSignIn}
                    disabled={isSigningIn}
                    className="w-full"
                    size="lg"
                >
                    <GoogleIcon className="mr-2 size-5" />
                    {isSigningIn
                        ? 'Redirecting...'
                        : 'Sign in with Google'}
                </Button>

                {error && (
                    <p className="text-center text-sm text-destructive">
                        {error}
                    </p>
                )}

                {website === null && (
                    <p className="rounded-md bg-muted p-3 text-center text-xs text-muted-foreground">
                        This dashboard isn&apos;t configured for
                        your domain yet. Contact PixelVerse
                        Studios if you believe this is an error.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error
    reset: () => void
}) {
    useEffect(() => {
        console.error('Global error:', error)
    }, [error])

    return (
        <html lang="en">
            <body className="min-h-screen bg-background font-sans antialiased">
                <div className="flex min-h-screen items-center justify-center p-6">
                    <div className="max-w-md text-center">
                        <p className="text-sm font-medium text-destructive">Error</p>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                            Something went wrong
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            An unexpected error occurred. Please try again or contact support if the problem persists.
                        </p>
                        <div className="mt-6">
                            <Button onClick={reset} className="cursor-pointer">
                                Try again
                            </Button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}

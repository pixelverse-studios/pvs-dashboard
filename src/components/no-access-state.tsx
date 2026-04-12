'use client'

import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth-service'

export const NoAccessState = () => (
    <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center">
            <h1 className="mb-2 text-2xl font-semibold">
                No access yet
            </h1>
            <p className="mb-6 text-muted-foreground">
                Your account doesn&apos;t have any CMS assignments.
                Please contact your PixelVerse Studios admin to get
                access.
            </p>
            <Button onClick={() => signOut()}>Sign out</Button>
        </div>
    </div>
)

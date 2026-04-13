'use client'

import { ShieldX, Mail, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/auth-provider'
import { signOut } from '@/lib/auth-service'

export const NoAccessState = () => {
    const { session } = useAuth()
    const email = session?.user?.email

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
            <div className="relative max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                <div className="rounded-2xl border border-border bg-card px-8 py-12 text-center shadow-lg">
                    <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
                        <ShieldX
                            className="size-10 text-primary"
                            strokeWidth={1.5}
                        />
                    </div>

                    <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
                        Access pending
                    </h1>
                    <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
                        You&apos;re signed in, but your account
                        doesn&apos;t have any CMS assignments yet.
                        A PixelVerse Studios admin needs to grant
                        you access.
                    </p>

                    {email && (
                        <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-muted/60 px-4 py-2 text-xs text-muted-foreground">
                            <Mail className="size-3.5" />
                            {email}
                        </div>
                    )}

                    <div className="mt-8 flex flex-col items-center gap-3">
                        <Button
                            onClick={() => signOut()}
                            variant="outline"
                            className="cursor-pointer gap-2 rounded-xl"
                        >
                            <LogOut className="size-4" />
                            Sign out
                        </Button>
                        <p className="text-xs text-muted-foreground/50">
                            Try signing in with a different account,
                            or contact your admin.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

'use client'

import { ArrowRight, Command, LogOut, Mail, ShieldX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/auth-provider'
import { signInWithGoogle, signOut } from '@/lib/auth-service'

const handleSignOut = () => {
    signOut().catch(() => {
        window.location.href = '/login'
    })
}

const handleSwitchAccount = async () => {
    try {
        await signOut()
        await signInWithGoogle()
    } catch {
        window.location.href = '/login'
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
                <div className="h-full w-[42%] rounded-full bg-primary" />
            </div>
        </div>
    )
}

export const NoAccessState = () => {
    const { session } = useAuth()
    const email = session?.user?.email

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-5 py-8">
            <div className="w-full max-w-[760px] overflow-hidden border border-border bg-white">
                <CommandStrip label="PVS CMS" status="Access check" />

                <div className="grid gap-6 px-5 py-7 md:grid-cols-[minmax(0,1fr)_220px] md:px-8 md:py-8">
                    <div className="space-y-5">
                        <div className="inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            <ShieldX className="size-3.5 text-primary" />
                            Permission required
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-4xl font-semibold leading-[0.95] tracking-[-0.075em] text-foreground md:text-5xl">
                                Access pending
                            </h1>
                            <p className="max-w-lg text-sm leading-7 text-muted-foreground">
                                You are signed in, but this account does not have a CMS assignment
                                yet. A PixelVerse Studios admin needs to grant access before you can
                                continue.
                            </p>
                        </div>

                        {email ? (
                            <div className="inline-flex max-w-full items-center gap-2 border border-border bg-muted/35 px-3 py-2 text-sm text-muted-foreground">
                                <Mail className="size-4 shrink-0 text-primary" />
                                <span className="truncate">{email}</span>
                            </div>
                        ) : null}

                        <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
                            <Button
                                onClick={handleSignOut}
                                variant="outline"
                                className="cursor-pointer gap-2 rounded-none"
                            >
                                <LogOut className="size-4" />
                                Sign out
                            </Button>
                            <Button
                                onClick={handleSwitchAccount}
                                variant="ghost"
                                className="cursor-pointer gap-2 rounded-none text-muted-foreground"
                            >
                                Try another account
                                <ArrowRight className="size-4" />
                            </Button>
                        </div>
                    </div>

                    <aside className="border-l-2 border-warning bg-warning/8 px-4 py-4">
                        <p className="text-sm font-semibold text-foreground">Next step</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Ask a PVS admin to add this Google account to the correct client
                            workspace.
                        </p>
                        {email ? (
                            <p className="mt-4 break-all font-mono text-xs text-muted-foreground">
                                {email}
                            </p>
                        ) : null}
                    </aside>
                </div>

                <footer className="border-t border-border bg-[#f8f8f6] px-5 py-3 text-xs text-muted-foreground md:px-8">
                    Powered by PixelVerse Studios
                </footer>
            </div>
        </div>
    )
}

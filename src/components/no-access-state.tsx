'use client'

import { ShieldX, Mail, LogOut, ArrowRight } from 'lucide-react'
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

export const NoAccessState = () => {
    const { session } = useAuth()
    const email = session?.user?.email

    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <div className="absolute inset-x-0 top-0 h-[45vh] overflow-hidden">
                <div
                    className="absolute inset-0 bg-gradient-to-br
                        from-primary/8 via-secondary/5
                        to-transparent"
                />
                <div
                    className="absolute inset-0
                        bg-[radial-gradient(ellipse_at_50%_0%,var(--primary)_/_0.08,transparent_70%)]"
                />
                <div
                    className="absolute inset-x-0 bottom-0 h-32
                        bg-gradient-to-t from-background
                        to-transparent"
                />
            </div>

            <div className="relative flex flex-1 flex-col items-center justify-center px-6">
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div
                        className="mx-auto mb-8 flex size-24
                            items-center justify-center rounded-3xl
                            bg-gradient-to-br from-primary/10
                            to-secondary/10 ring-1 ring-primary/10"
                    >
                        <ShieldX
                            className="size-12 text-primary/70"
                            strokeWidth={1.2}
                        />
                    </div>
                </div>

                <div
                    className="animate-in fade-in
                        slide-in-from-bottom-4 duration-700
                        fill-mode-both delay-100"
                >
                    <h1
                        className="text-center text-3xl font-bold
                            tracking-tight text-foreground
                            sm:text-4xl"
                    >
                        Access pending
                    </h1>
                </div>

                <div
                    className="animate-in fade-in
                        slide-in-from-bottom-3 duration-700
                        fill-mode-both delay-200"
                >
                    <p
                        className="mt-4 max-w-md text-center
                            text-base leading-relaxed
                            text-muted-foreground"
                    >
                        You&apos;re signed in, but your account
                        doesn&apos;t have any CMS assignments yet.
                        A PixelVerse Studios admin needs to grant
                        you access before you can continue.
                    </p>
                </div>

                {email && (
                    <div
                        className="animate-in fade-in duration-500
                            fill-mode-both delay-300"
                    >
                        <div
                            className="mt-6 flex items-center gap-2
                                rounded-full border border-border
                                bg-muted/40 px-5 py-2.5 text-sm
                                text-muted-foreground"
                        >
                            <Mail className="size-4" />
                            {email}
                        </div>
                    </div>
                )}

                <div
                    className="animate-in fade-in
                        slide-in-from-bottom-2 duration-500
                        fill-mode-both delay-500"
                >
                    <div
                        className="mt-10 flex flex-col
                            items-center gap-4 sm:flex-row"
                    >
                        <Button
                            onClick={handleSignOut}
                            variant="outline"
                            size="lg"
                            className="cursor-pointer gap-2
                                rounded-xl px-6"
                        >
                            <LogOut className="size-4" />
                            Sign out
                        </Button>
                        <Button
                            onClick={handleSwitchAccount}
                            variant="ghost"
                            size="lg"
                            className="cursor-pointer gap-2
                                text-muted-foreground"
                        >
                            Try a different account
                            <ArrowRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <footer
                className="relative pb-8 pt-4 text-center
                    text-xs text-muted-foreground/40"
            >
                Powered by PixelVerse Studios
            </footer>
        </div>
    )
}

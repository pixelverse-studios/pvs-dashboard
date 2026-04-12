import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        PVS Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Multi-tenant CMS dashboard. Theme tokens are wired via CSS variables.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Primary Theme</CardTitle>
                            <CardDescription>PVS purple brand color</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <div className="flex h-12 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                                --primary
                            </div>
                            <div className="flex gap-2">
                                <Button>Default</Button>
                                <Button variant="outline">Outline</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Secondary Theme</CardTitle>
                            <CardDescription>PVS magenta brand color</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <div className="flex h-12 items-center justify-center rounded-lg bg-secondary text-secondary-foreground text-sm font-medium">
                                --secondary
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="ghost">Ghost</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Runtime Theming</CardTitle>
                        <CardDescription>
                            Open DevTools and change CSS variables on :root to see the theme update
                            live. Try setting --primary to a different oklch value.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex flex-col items-center gap-1">
                                <div className="size-10 rounded-lg bg-primary" />
                                <span className="text-xs text-muted-foreground">primary</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="size-10 rounded-lg bg-secondary" />
                                <span className="text-xs text-muted-foreground">secondary</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="size-10 rounded-lg bg-accent" />
                                <span className="text-xs text-muted-foreground">accent</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="size-10 rounded-lg bg-muted" />
                                <span className="text-xs text-muted-foreground">muted</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="size-10 rounded-lg bg-destructive" />
                                <span className="text-xs text-muted-foreground">destructive</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground">
                    This demo page will be replaced by the dashboard shell in a future ticket.
                </p>
            </div>
        </div>
    )
}

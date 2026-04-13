import { type ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-background">
            <div className="relative hidden w-[55%] overflow-hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }} />
                <div className="relative flex h-full flex-col items-center justify-center px-12">
                    <div className="max-w-md text-center">
                        <div className="mb-8 inline-flex size-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                            <span className="text-2xl font-bold text-white">
                                P
                            </span>
                        </div>
                        <h2 className="mb-3 text-3xl font-bold tracking-tight text-white">
                            Your content,
                            <br />
                            your way.
                        </h2>
                        <p className="text-base text-white/70">
                            Manage your website content with an
                            intuitive dashboard built for your brand.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
                {children}
            </div>
        </div>
    )
}

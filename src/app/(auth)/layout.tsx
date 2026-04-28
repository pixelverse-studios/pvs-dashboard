import { type ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#f8f8f6] px-5 py-6 text-foreground md:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1180px] items-center justify-center">
                {children}
            </div>
        </div>
    )
}

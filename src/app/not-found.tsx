import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <div className="text-center">
                <p className="text-sm font-medium text-primary">
                    404
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                    Page not found
                </h1>
                <p className="mt-2 text-muted-foreground">
                    The page you&apos;re looking for
                    doesn&apos;t exist.
                </p>
                <div className="mt-6">
                    <Button
                        render={<Link href="/" />}
                        className="cursor-pointer"
                    >
                        Back to dashboard
                    </Button>
                </div>
            </div>
        </div>
    )
}

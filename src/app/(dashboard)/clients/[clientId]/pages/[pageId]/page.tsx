import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

export default async function ClientPageDetailPage({
    params,
}: {
    params: Promise<{ clientId: string, pageId: string }>
}) {
    const { clientId, pageId } = await params

    return (
        <div className="space-y-6 p-6 md:p-8">
            <Button
                variant="ghost"
                render={
                    <Link href={`/clients/${clientId}/pages`} />
                }
                className="gap-2"
            >
                <ArrowLeft className="size-4" />
                Back to pages
            </Button>

            <Card className="border border-border/80 shadow-[0_18px_48px_-44px_rgba(17,17,17,0.5)]">
                <CardHeader>
                    <div className="mb-2 rounded-2xl bg-primary/10 p-3 text-primary w-fit">
                        <FileText className="size-5" />
                    </div>
                    <CardTitle>Page editor coming next</CardTitle>
                    <CardDescription>
                        The pages list now routes into a dedicated detail path so the
                        editor can land here cleanly in the next ticket.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">
                        Selected page id: <span className="font-medium text-foreground">{pageId}</span>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

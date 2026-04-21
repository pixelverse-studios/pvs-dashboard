'use client'

import Link from 'next/link'
import { use, useState } from 'react'
import { ArrowLeft, Code2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { RichTextEditor } from '@/components/rich-text-editor'

const demoContent = `<h2>About PixelVerse Studios</h2><p>We help growing businesses launch websites that are clear, polished, and easy to update.</p><p><strong>Use this editor</strong> to validate formatting, links, lists, and blockquotes against the backend allowlist.</p><blockquote>Keep the editor honest: what Jennifer sees here should be what the server saves.</blockquote><ul><li>Bold, italic, underline</li><li>Headings, lists, and blockquotes</li><li>Links that open safely in a new tab</li></ul>`

export default function ClientPageDetailPage({
    params,
}: {
    params: Promise<{ clientId: string, pageId: string }>
}) {
    const { clientId, pageId } = use(params)
    const [value, setValue] = useState(demoContent)

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

            <section className="rounded-[1.2rem] border border-border/80 bg-white shadow-[0_18px_48px_-44px_rgba(17,17,17,0.5)]">
                <div className="grid gap-6 px-6 py-6 md:px-8 md:py-7 lg:grid-cols-[minmax(0,1fr)_260px]">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-[#f7f7fb] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                            <FileText className="size-3.5" />
                            Rich text editor demo
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-[2.2rem] font-semibold tracking-[-0.06em] text-foreground md:text-[3rem]">
                                Tiptap editor surface
                            </h1>
                            <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-[0.95rem]">
                                This route now demonstrates the shared rich text
                                editor for `DEV-704`, including formatting
                                controls, safe link insertion, and canonical HTML
                                output.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 rounded-[1rem] border border-border/70 bg-[#fcfcfe] p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            Demo context
                        </p>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>
                                <span className="font-medium text-foreground">Page ID:</span>{' '}
                                {pageId}
                            </p>
                            <p>
                                <span className="font-medium text-foreground">Output:</span>{' '}
                                HTML string
                            </p>
                            <p>
                                <span className="font-medium text-foreground">Paste mode:</span>{' '}
                                plain text
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <Card className="rounded-[1.2rem] border border-border/80 shadow-[0_18px_48px_-44px_rgba(17,17,17,0.5)]">
                    <CardHeader className="border-b border-border/70">
                        <CardTitle>Editor</CardTitle>
                        <CardDescription>
                            Toolbar options are intentionally limited to the
                            sanitize-allowed formatting set.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="py-5">
                        <RichTextEditor
                            value={value}
                            onChange={setValue}
                            placeholder="Write the page content here…"
                        />
                    </CardContent>
                </Card>

                <Card className="rounded-[1.2rem] border border-border/80 shadow-[0_18px_48px_-44px_rgba(17,17,17,0.5)]">
                    <CardHeader className="border-b border-border/70">
                        <div className="mb-2 flex size-9 items-center justify-center rounded-[0.85rem] bg-primary/10 text-primary">
                            <Code2 className="size-4.5" />
                        </div>
                        <CardTitle>HTML output</CardTitle>
                        <CardDescription>
                            This is the exact string emitted through `onChange`.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="py-5">
                        <pre className="min-h-[280px] overflow-x-auto rounded-[1rem] border border-border/70 bg-[#fcfcfe] p-4 text-xs leading-6 text-foreground whitespace-pre-wrap break-words">
                            {value || '""'}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

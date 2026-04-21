'use client'

import Link from 'next/link'
import { use, useRef, useState } from 'react'
import { ArrowLeft, CheckCircle2, FileText, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    DynamicForm,
    type DynamicFormHandle,
} from '@/components/dynamic-form'
import type { CmsTemplate } from '@/types/cms-template'

const demoTemplate: CmsTemplate = {
    id: 'demo-template',
    slug: 'about-page',
    label: 'About Page',
    fields: [
        {
            key: 'headline',
            type: 'text',
            label: 'Headline',
            help: 'Primary title displayed near the top of the page.',
            required: true,
            max_length: 80,
        },
        {
            key: 'summary',
            type: 'textarea',
            label: 'Summary',
            help: 'Short supporting summary for the hero section.',
            required: true,
            max_length: 180,
        },
        {
            key: 'body',
            type: 'rich_text',
            label: 'Body copy',
            help: 'Main editorial content for the page.',
            required: true,
        },
        {
            key: 'show_testimonial',
            type: 'boolean',
            label: 'Show testimonial highlight',
            help: 'Display the highlighted testimonial block on this page.',
        },
        {
            key: 'hero_image',
            type: 'image',
            label: 'Hero image',
            help: 'Uploads are intentionally deferred for this milestone.',
        },
        {
            key: 'legacy_embed',
            type: 'iframe',
            label: 'Legacy embed',
            help: 'Used to prove unsupported field types fail safely.',
        },
    ],
}

const demoValues = {
    headline: 'About PixelVerse Studios',
    summary:
        'A small, high-touch studio helping growing businesses launch polished websites they can actually maintain.',
    body: '<h2>What we do</h2><p>We build websites that are clear, fast, and easy to update after launch.</p><p><strong>Use this field</strong> to validate formatting, links, and lists inside the renderer.</p>',
    show_testimonial: true,
    hero_image: 'https://images.pixelversestudios.io/about/hero.jpg',
    legacy_embed: '<iframe src="https://example.com"></iframe>',
}

export default function ClientPageDetailPage({
    params,
}: {
    params: Promise<{ clientId: string, pageId: string }>
}) {
    const { clientId, pageId } = use(params)
    const formRef = useRef<DynamicFormHandle>(null)
    const [isDirty, setIsDirty] = useState(false)
    const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = async () => {
        setIsSaving(true)
        await new Promise((resolve) => setTimeout(resolve, 350))
        setLastSavedAt(new Date().toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
        }))
        setIsSaving(false)
    }

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
                                Dynamic template-driven editor
                            </h1>
                            <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-[0.95rem]">
                                This route now demonstrates the shared renderer
                                for `DEV-705`, driven entirely by template field
                                definitions instead of hardcoded form inputs.
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
                                <span className="font-medium text-foreground">Paste mode:</span>{' '}
                                plain text
                            </p>
                            <p>
                                <span className="font-medium text-foreground">Template fields:</span>{' '}
                                {demoTemplate.fields.length}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <Card className="rounded-[1.2rem] border border-border/80 shadow-[0_18px_48px_-44px_rgba(17,17,17,0.5)]">
                    <CardHeader className="border-b border-border/70">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                                <CardTitle>Form renderer</CardTitle>
                                <CardDescription>
                                    Fields are rendered in template order with
                                    validation and graceful unsupported-field fallbacks.
                                </CardDescription>
                            </div>
                            <Button
                                type="button"
                                onClick={() => formRef.current?.submit()}
                                disabled={!isDirty || isSaving}
                                className="gap-2"
                            >
                                <Save className="size-4" />
                                {isSaving ? 'Saving…' : 'Save changes'}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="py-5">
                        <DynamicForm
                            ref={formRef}
                            template={demoTemplate}
                            initialValues={demoValues}
                            onSubmit={handleSubmit}
                            onDirtyChange={setIsDirty}
                        />
                    </CardContent>
                </Card>

                <Card className="rounded-[1.2rem] border border-border/80 shadow-[0_18px_48px_-44px_rgba(17,17,17,0.5)]">
                    <CardHeader className="border-b border-border/70">
                        <div className="mb-2 flex size-9 items-center justify-center rounded-[0.85rem] bg-primary/10 text-primary">
                            <CheckCircle2 className="size-4.5" />
                        </div>
                        <CardTitle>Renderer state</CardTitle>
                        <CardDescription>
                            Quick proof that the parent can observe dirty state
                            and trigger save without hardcoding individual fields.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 py-5">
                        <div className="rounded-[1rem] border border-border/70 bg-[#fcfcfe] p-4">
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                Dirty state
                            </p>
                            <p className="mt-2 text-sm text-foreground">
                                {isDirty ? 'Unsaved changes present' : 'Form matches initial values'}
                            </p>
                        </div>

                        <div className="rounded-[1rem] border border-border/70 bg-[#fcfcfe] p-4">
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                Last saved
                            </p>
                            <p className="mt-2 text-sm text-foreground">
                                {lastSavedAt ?? 'Not saved in this session'}
                            </p>
                        </div>

                        <div className="rounded-[1rem] border border-dashed border-border/90 bg-[#fcfcfe] p-4">
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                Included in this demo
                            </p>
                            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                <li>`text` with max length</li>
                                <li>`textarea` with max length</li>
                                <li>`rich_text` via Tiptap</li>
                                <li>`boolean` with switch UI</li>
                                <li>`image` placeholder</li>
                                <li>unknown field warning</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

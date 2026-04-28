'use client'

import Link from 'next/link'
import { use, useRef, useState } from 'react'
import { ArrowLeft, Layers3, LayoutTemplate, Link2, PanelRight, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DynamicForm, type DynamicFormHandle } from '@/components/dynamic-form'
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

const demoRoute = '/about'

function MetaPill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/80 px-3 py-1.5 text-sm text-muted-foreground shadow-[0_12px_24px_-24px_rgba(15,23,42,0.35)]">
            <span className="text-primary">{icon}</span>
            <span>{children}</span>
        </div>
    )
}

function formatEditableSummary(totalFields: number, editableFields: number) {
    const lockedFields = Math.max(totalFields - editableFields, 0)

    if (lockedFields === 0) {
        return `${editableFields} editable fields`
    }

    return `${editableFields} editable · ${lockedFields} locked`
}

export default function ClientPageDetailPage({
    params,
}: {
    params: Promise<{ clientId: string; pageId: string }>
}) {
    const { clientId } = use(params)
    const formRef = useRef<DynamicFormHandle>(null)
    const [isDirty, setIsDirty] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const editableFieldCount = demoTemplate.fields.filter((field) => field.type !== 'iframe').length
    const pageUrl = `https://www.pixelversestudios.io${demoRoute}`

    const handleSubmit = async () => {
        setIsSaving(true)
        await new Promise((resolve) => setTimeout(resolve, 350))
        setIsSaving(false)
    }

    return (
        <div className="space-y-6 bg-[linear-gradient(180deg,#fbfaf8_0%,#ffffff_22%,#ffffff_100%)] p-6 md:p-8">
            <Button
                variant="ghost"
                render={<Link href={`/clients/${clientId}/pages`} />}
                className="gap-2"
            >
                <ArrowLeft className="size-4" />
                Back to pages
            </Button>

            <div className="flex flex-col gap-5 rounded-xl border border-border/70 bg-white/92 p-5 shadow-[0_18px_34px_-34px_rgba(17,17,17,0.18)] backdrop-blur md:p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="max-w-3xl space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-[#f7f7fb] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
                            <LayoutTemplate className="size-3.5" />
                            Page editor
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-[1.9rem] font-semibold tracking-[-0.06em] text-foreground md:text-[2.6rem]">
                                {demoTemplate.label}
                            </h1>
                            <a
                                href={pageUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-white/85 px-3.5 py-2 text-sm text-muted-foreground shadow-[0_14px_30px_-28px_rgba(15,23,42,0.32)] transition hover:border-primary/25 hover:text-foreground"
                            >
                                <span className="inline-flex size-7 items-center justify-center rounded-full bg-[#f6f4ff] text-primary">
                                    <Link2 className="size-3.5" />
                                </span>
                                <span className="font-medium text-foreground">{pageUrl}</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <div className="ml-auto flex flex-wrap items-center gap-2.5">
                        <MetaPill icon={<PanelRight className="size-3.5" />}>
                            {formatEditableSummary(demoTemplate.fields.length, editableFieldCount)}
                        </MetaPill>
                        <MetaPill icon={<Layers3 className="size-3.5" />}>
                            {demoTemplate.fields.length} total fields
                        </MetaPill>
                    </div>
                </div>
            </div>

            <section className="space-y-6">
                <div className="flex justify-end">
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

                <div className="px-1">
                    <DynamicForm
                        ref={formRef}
                        template={demoTemplate}
                        initialValues={demoValues}
                        onSubmit={handleSubmit}
                        onDirtyChange={setIsDirty}
                    />
                </div>
            </section>
        </div>
    )
}

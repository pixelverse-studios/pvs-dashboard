'use client'

import Link from 'next/link'
import { use, useEffect, useRef, useState } from 'react'
import {
    ArrowLeft,
    Check,
    CircleDot,
    Command,
    Keyboard,
    Layers3,
    Link2,
    Save,
    ShieldCheck,
    TriangleAlert,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { DynamicForm, type DynamicFormHandle } from '@/components/dynamic-form'
import { cn } from '@/lib/utils'
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
const initialPublished = false

function CommandStrip({ label, status }: { label: string; status: string }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-border bg-white/90 px-4 py-3 backdrop-blur">
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
                <div className="h-full w-[58%] rounded-full bg-primary" />
            </div>
        </div>
    )
}

function StatusBadge({
    children,
    tone = 'neutral',
}: {
    children: React.ReactNode
    tone?: 'neutral' | 'primary' | 'success' | 'warning'
}) {
    const tones = {
        neutral: 'border-border bg-white text-muted-foreground',
        primary: 'border-primary/20 bg-primary/6 text-primary',
        success: 'border-success/20 bg-success/8 text-success',
        warning: 'border-warning/25 bg-warning/10 text-warning',
    }

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold',
                tones[tone],
            )}
        >
            {children}
        </span>
    )
}

function InspectorItem({
    icon: Icon,
    label,
    value,
    active,
}: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: string
    active?: boolean
}) {
    return (
        <div
            className={cn(
                'grid grid-cols-[32px_minmax(0,1fr)] gap-3 border-t border-border px-4 py-4 first:border-t-0',
                active && 'bg-primary/4',
            )}
        >
            <div
                className={cn(
                    'flex size-8 items-center justify-center rounded-lg border',
                    active
                        ? 'border-primary/20 bg-primary/8 text-primary'
                        : 'border-border bg-muted/40 text-muted-foreground',
                )}
            >
                <Icon className="size-4" />
            </div>
            <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{value}</p>
            </div>
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
    const [currentPublished, setCurrentPublished] = useState(initialPublished)
    const [stagedPublished, setStagedPublished] = useState(initialPublished)
    const [lastSavedAt, setLastSavedAt] = useState('Just now')

    const editableFieldCount = demoTemplate.fields.filter((field) => field.type !== 'iframe').length
    const pageUrl = `https://www.pixelversestudios.io${demoRoute}`
    const publishDirty = stagedPublished !== currentPublished
    const hasPendingChanges = isDirty || publishDirty
    const saveStatus = isSaving
        ? 'Saving changes'
        : hasPendingChanges
          ? 'Unsaved changes'
          : 'All changes saved'
    const nextStatusLabel = stagedPublished ? 'Published' : 'Draft'
    const currentStatusLabel = currentPublished ? 'Published' : 'Draft'

    useEffect(() => {
        if (!hasPendingChanges) return

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault()
            event.returnValue = ''
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [hasPendingChanges])

    const handleSubmit = async () => {
        setIsSaving(true)
        await new Promise((resolve) => setTimeout(resolve, 350))
        setCurrentPublished(stagedPublished)
        setLastSavedAt('Just now')
        setIsSaving(false)
        toast.success('Page changes saved')
    }

    const handleBackClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!hasPendingChanges) return

        const confirmed = window.confirm('Leave without saving your page changes?')
        if (!confirmed) {
            event.preventDefault()
        }
    }

    return (
        <div className="min-h-full bg-[#f8f8f6] pb-24 md:pb-10">
            <div className="sticky top-0 z-20 border-b border-border bg-[#f8f8f6]/92 px-5 py-3 backdrop-blur md:px-8">
                <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Back to pages"
                            render={
                                <Link
                                    href={`/clients/${clientId}/pages`}
                                    onClick={handleBackClick}
                                />
                            }
                        >
                            <ArrowLeft className="size-4" />
                        </Button>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                                {demoTemplate.label}
                            </p>
                            <p className="text-xs text-muted-foreground">{saveStatus}</p>
                        </div>
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        <StatusBadge tone={hasPendingChanges ? 'warning' : 'success'}>
                            <span className="size-1.5 rounded-full bg-current" />
                            {hasPendingChanges ? 'Dirty' : 'Saved'}
                        </StatusBadge>
                        <Button
                            type="button"
                            onClick={() => formRef.current?.submit()}
                            disabled={!hasPendingChanges || isSaving}
                            className="gap-2 rounded-none"
                        >
                            <Save className="size-4" />
                            {isSaving ? 'Saving' : 'Save changes'}
                        </Button>
                    </div>
                </div>
            </div>

            <main className="mx-auto grid max-w-[1480px] gap-6 px-5 py-8 md:px-8 md:py-10 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="min-w-0 space-y-6">
                    <section className="border border-border bg-white">
                        <CommandStrip label="Page editor" status="Focused editing surface" />
                        <div className="grid gap-7 px-5 py-7 md:px-8 md:py-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
                            <div className="max-w-4xl space-y-5">
                                <div className="inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    <CircleDot className="size-3 text-primary" />
                                    Editor
                                </div>
                                <div className="space-y-4">
                                    <h1 className="text-4xl font-semibold leading-[0.95] tracking-[-0.075em] text-foreground md:text-6xl">
                                        {demoTemplate.label}
                                    </h1>
                                    <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                                        Edit the page content, stage publish status, then save from
                                        the sticky command controls.
                                    </p>
                                </div>
                                <a
                                    href={pageUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex max-w-full items-center gap-2 border border-border bg-[#f8f8f6] px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                                >
                                    <Link2 className="size-4 text-primary" />
                                    <span className="truncate">{pageUrl}</span>
                                </a>
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                                <div className="border-l-2 border-border bg-white px-3 py-2">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        Fields
                                    </p>
                                    <p className="mt-1 text-2xl font-semibold tracking-[-0.055em] text-foreground">
                                        {formatEditableSummary(demoTemplate.fields.length, editableFieldCount)}
                                    </p>
                                </div>
                                <div className="border-l-2 border-primary bg-primary/4 px-3 py-2">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        Next status
                                    </p>
                                    <p className="mt-1 text-2xl font-semibold tracking-[-0.055em] text-foreground">
                                        {nextStatusLabel}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {hasPendingChanges ? (
                        <div className="border-l-2 border-warning bg-warning/8 px-4 py-3">
                            <div className="flex items-start gap-3">
                                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Unsaved editor changes
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        Save or discard changes before leaving this editor.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <section className="border border-border bg-white px-5 py-6 md:px-7">
                        <DynamicForm
                            ref={formRef}
                            template={demoTemplate}
                            initialValues={demoValues}
                            onSubmit={handleSubmit}
                            onDirtyChange={setIsDirty}
                            disabled={isSaving}
                        />
                    </section>
                </div>

                <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
                    <section className="overflow-hidden border border-border bg-white">
                        <CommandStrip label="Inspector" status="Publish and validation" />
                        <div className="border-l-2 border-primary bg-primary/4 px-4 py-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Stage published status
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Applies on next save
                                    </p>
                                </div>
                                <Switch
                                    checked={stagedPublished}
                                    onCheckedChange={setStagedPublished}
                                    disabled={isSaving}
                                    aria-label="Stage published status"
                                />
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <StatusBadge tone={currentPublished ? 'success' : 'warning'}>
                                    Current: {currentStatusLabel}
                                </StatusBadge>
                                <StatusBadge tone={publishDirty ? 'primary' : 'neutral'}>
                                    Next: {nextStatusLabel}
                                </StatusBadge>
                            </div>
                        </div>
                        <div>
                            <InspectorItem
                                icon={Save}
                                label="Save state"
                                value={saveStatus}
                                active={hasPendingChanges}
                            />
                            <InspectorItem
                                icon={ShieldCheck}
                                label="Validation"
                                value="Required fields checked on save"
                            />
                            <InspectorItem
                                icon={Link2}
                                label="Page URL"
                                value={demoRoute}
                            />
                            <InspectorItem
                                icon={Keyboard}
                                label="Keyboard"
                                value="Save control remains sticky"
                            />
                            <InspectorItem
                                icon={Layers3}
                                label="Template"
                                value={`${demoTemplate.fields.length} fields total`}
                            />
                        </div>
                    </section>

                    <section className="overflow-hidden border border-border bg-white">
                        <CommandStrip label="Save cluster" status={saveStatus} />
                        <div className="space-y-4 px-4 py-4">
                            <div className="border-l-2 border-border pl-3">
                                <p className="text-sm font-semibold text-foreground">
                                    Last saved
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">{lastSavedAt}</p>
                            </div>
                            <Button
                                type="button"
                                onClick={() => formRef.current?.submit()}
                                disabled={!hasPendingChanges || isSaving}
                                className="w-full gap-2 rounded-none"
                            >
                                {hasPendingChanges ? (
                                    <Save className="size-4" />
                                ) : (
                                    <Check className="size-4" />
                                )}
                                {isSaving ? 'Saving' : hasPendingChanges ? 'Save changes' : 'Saved'}
                            </Button>
                            <Button
                                variant="outline"
                                render={
                                    <Link
                                        href={`/clients/${clientId}/pages`}
                                        onClick={handleBackClick}
                                    />
                                }
                                className="w-full gap-2 rounded-none"
                            >
                                <ArrowLeft className="size-4" />
                                Back to pages
                            </Button>
                        </div>
                    </section>
                </aside>
            </main>

            <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-white/92 px-5 py-3 backdrop-blur md:hidden">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                            {saveStatus}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Next: {nextStatusLabel}
                        </p>
                    </div>
                    <Button
                        type="button"
                        onClick={() => formRef.current?.submit()}
                        disabled={!hasPendingChanges || isSaving}
                        className="gap-2 rounded-none"
                    >
                        <Save className="size-4" />
                        {isSaving ? 'Saving' : 'Save'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

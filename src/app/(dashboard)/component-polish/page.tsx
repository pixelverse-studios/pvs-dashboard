'use client'

import { useState } from 'react'
import {
    AlertTriangle,
    ArrowLeft,
    Check,
    ChevronRight,
    CircleDot,
    Clock3,
    Command,
    Eye,
    FileText,
    ImageIcon,
    Info,
    Keyboard,
    Layers3,
    Link2,
    Loader2,
    PanelRight,
    Save,
    Search,
    Send,
    Settings2,
    ShieldCheck,
    Sparkles,
    Type,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { NoAccessState } from '@/components/no-access-state'
import { useAuth } from '@/providers/auth-provider'
import { cn } from '@/lib/utils'

const palette = [
    { name: 'Primary', token: '--primary', value: '#3f00e9', className: 'bg-primary' },
    { name: 'Background', token: '--background', value: '#ffffff', className: 'bg-background' },
    { name: 'Foreground', token: '--foreground', value: '#111111', className: 'bg-foreground' },
    { name: 'Muted', token: '--muted', value: '#f7f7fb', className: 'bg-muted' },
    { name: 'Border', token: '--border', value: '#e6e6ef', className: 'bg-border' },
    { name: 'Success', token: '--success', value: '#10b981', className: 'bg-success' },
    { name: 'Warning', token: '--warning', value: '#f59e0b', className: 'bg-warning' },
    { name: 'Destructive', token: '--destructive', value: '#ef4444', className: 'bg-destructive' },
]

const pageRows = [
    {
        title: 'Home Page',
        route: '/',
        status: 'Published',
        updated: '18 min ago',
        fields: '6 fields',
    },
    {
        title: 'About the Studio',
        route: '/about',
        status: 'Draft',
        updated: 'Yesterday',
        fields: '5 fields',
    },
    {
        title: 'Contact',
        route: '/contact',
        status: 'Published',
        updated: 'Mar 28',
        fields: '4 fields',
    },
]

const inspectorItems = [
    { label: 'Publish', value: 'Draft staged', icon: Send, active: true },
    { label: 'Validation', value: '1 item needs review', icon: ShieldCheck },
    { label: 'Page URL', value: '/about', icon: Link2 },
    { label: 'Keyboard', value: 'Cmd+S saves', icon: Keyboard },
]

const stateExamples = [
    {
        label: 'Loading',
        detail: 'Skeletons mirror layout shape before data arrives.',
        icon: Loader2,
        className: 'text-primary',
    },
    {
        label: 'Empty',
        detail: 'A clear setup note without decorative filler.',
        icon: FileText,
        className: 'text-muted-foreground',
    },
    {
        label: 'Error',
        detail: 'Inline recovery keeps the editor context intact.',
        icon: AlertTriangle,
        className: 'text-destructive',
    },
    {
        label: 'Saved',
        detail: 'Quiet confirmation, not a celebration.',
        icon: Check,
        className: 'text-success',
    },
]

function SectionHeader({
    eyebrow,
    title,
    children,
}: {
    eyebrow: string
    title: string
    children: React.ReactNode
}) {
    return (
        <div className="space-y-2">
            <div className="inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <CircleDot className="size-3 text-primary" />
                {eyebrow}
            </div>
            <div className="grid gap-3 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,0.28fr)] lg:items-end">
                <h2 className="text-2xl font-semibold tracking-[-0.055em] text-foreground md:text-3xl">
                    {title}
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">{children}</p>
            </div>
        </div>
    )
}

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
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[64%] rounded-full bg-primary" />
            </div>
        </div>
    )
}

function FocusField({
    label,
    help,
    active,
    children,
}: {
    label: string
    help: string
    active?: boolean
    children: React.ReactNode
}) {
    return (
        <div
            className={cn(
                'relative border-l-2 py-1 pl-5 transition-colors',
                active ? 'border-primary' : 'border-border',
            )}
        >
            <div className="mb-2 space-y-1">
                <label className="text-sm font-semibold text-foreground">{label}</label>
                <p className="text-sm leading-6 text-muted-foreground">{help}</p>
            </div>
            {children}
        </div>
    )
}

function StatusBadge({
    children,
    tone = 'neutral',
}: {
    children: React.ReactNode
    tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'destructive'
}) {
    const tones = {
        neutral: 'border-border bg-white text-muted-foreground',
        primary: 'border-primary/20 bg-primary/6 text-primary',
        success: 'border-success/20 bg-success/8 text-success',
        warning: 'border-warning/25 bg-warning/10 text-warning',
        destructive: 'border-destructive/20 bg-destructive/8 text-destructive',
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

function PageRow({ page, index }: { page: (typeof pageRows)[number]; index: number }) {
    const published = page.status === 'Published'

    return (
        <div className="group grid gap-4 border-t border-border px-4 py-4 transition-colors hover:bg-primary/4 md:grid-cols-[48px_minmax(0,1fr)_140px_120px_28px] md:items-center">
            <div className="font-mono text-xs font-semibold text-muted-foreground">
                {(index + 1).toString().padStart(2, '0')}
            </div>
            <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{page.title}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{page.route}</p>
            </div>
            <StatusBadge tone={published ? 'success' : 'warning'}>{page.status}</StatusBadge>
            <div className="text-xs text-muted-foreground">{page.updated}</div>
            <ChevronRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
    )
}

function InspectorPanel() {
    return (
        <aside className="overflow-hidden border border-border bg-white">
            <CommandStrip label="Inspector" status="Review before saving" />
            <div className="divide-y divide-border">
                {inspectorItems.map((item) => {
                    const Icon = item.icon

                    return (
                        <div
                            key={item.label}
                            className={cn(
                                'grid grid-cols-[32px_minmax(0,1fr)] gap-3 px-4 py-4',
                                item.active && 'bg-primary/4',
                            )}
                        >
                            <div
                                className={cn(
                                    'flex size-8 items-center justify-center rounded-lg border',
                                    item.active
                                        ? 'border-primary/20 bg-primary/8 text-primary'
                                        : 'border-border bg-muted/40 text-muted-foreground',
                                )}
                            >
                                <Icon className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground">
                                    {item.label}
                                </p>
                                <p className="mt-1 truncate text-xs text-muted-foreground">
                                    {item.value}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </aside>
    )
}

function StateBlock({ state }: { state: (typeof stateExamples)[number] }) {
    const Icon = state.icon

    return (
        <div className="border-t border-border px-4 py-4">
            <div className="flex items-start gap-3">
                <Icon className={cn('mt-0.5 size-4', state.className)} />
                <div>
                    <p className="text-sm font-semibold text-foreground">{state.label}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{state.detail}</p>
                </div>
            </div>
        </div>
    )
}

export default function ComponentPolishPage() {
    const { isPvsAdmin } = useAuth()
    const [published, setPublished] = useState(false)
    const [notify, setNotify] = useState(true)

    if (!isPvsAdmin) {
        return <NoAccessState />
    }

    return (
        <div className="min-h-full bg-[#f8f8f6]">
            <div className="sticky top-0 z-20 border-b border-border bg-[#f8f8f6]/92 px-5 py-3 backdrop-blur md:px-8">
                <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <Button variant="ghost" size="icon-sm" aria-label="Back to command center">
                            <ArrowLeft className="size-4" />
                        </Button>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                                Elements
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Review route for Phil and Sami
                            </p>
                        </div>
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        <StatusBadge tone="primary">Theme: --primary</StatusBadge>
                        <Button variant="outline" className="gap-2">
                            <Eye className="size-4" />
                            Review mode
                        </Button>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-[1480px] space-y-10 px-5 py-8 md:px-8 md:py-10">
                <section className="grid gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(360px,0.3fr)]">
                    <div className="border border-border bg-white">
                        <CommandStrip label="CMS design system" status="Focused editor baseline" />
                        <div className="grid gap-8 px-5 py-7 md:px-8 md:py-9 xl:grid-cols-[minmax(0,0.72fr)_minmax(240px,0.28fr)]">
                            <div className="space-y-5">
                                <div className="inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    <Sparkles className="size-3.5 text-primary" />
                                    Elements
                                </div>
                                <div className="max-w-4xl space-y-4">
                                    <h1 className="text-4xl font-semibold leading-[0.95] tracking-[-0.075em] text-foreground md:text-6xl">
                                        Focused CMS patterns for client editing.
                                    </h1>
                                    <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                                        This page previews the reusable language for the CMS:
                                        command strips, focus rails, inspector panels, status
                                        feedback, form states, and a restrained theme-color system.
                                    </p>
                                </div>
                            </div>

                            <div className="border-l border-border pl-5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Rules
                                </p>
                                <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                                    <p>Use `--primary` for state and focus, not decoration.</p>
                                    <p>Prefer dividers, rails, and panels over heavy cards.</p>
                                    <p>Every component must show its working states.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <InspectorPanel />
                </section>

                <section className="space-y-5">
                    <SectionHeader eyebrow="01 Palette" title="Tokens and theme-color usage">
                        The playground treats the theme color as a reusable control language across
                        focus, navigation, validation, progress, and status.
                    </SectionHeader>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {palette.map((color) => (
                            <div key={color.token} className="border border-border bg-white p-4">
                                <div className={cn('h-16 border border-border', color.className)} />
                                <div className="mt-4 flex items-end justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {color.name}
                                        </p>
                                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                                            {color.token}
                                        </p>
                                    </div>
                                    <p className="font-mono text-xs text-muted-foreground">
                                        {color.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,0.64fr)_minmax(360px,0.36fr)]">
                    <div className="space-y-5">
                        <SectionHeader
                            eyebrow="02 Form System"
                            title="Focused fields and editor rhythm"
                        >
                            Labels stay above controls, helper text stays close, and the active
                            field gets a slim theme-color rail.
                        </SectionHeader>

                        <div className="border border-border bg-white px-5 py-6 md:px-7">
                            <div className="space-y-7">
                                <FocusField
                                    active
                                    label="Headline"
                                    help="Primary title displayed near the top of the page."
                                >
                                    <Input defaultValue="About Iffers Pictures" />
                                </FocusField>

                                <FocusField
                                    label="Summary"
                                    help="A short supporting sentence for scan-heavy pages."
                                >
                                    <Textarea defaultValue="A production studio shaping sharp visual stories for hospitality, retail, and independent brands." />
                                </FocusField>

                                <FocusField
                                    label="Body copy"
                                    help="Rich text toolbar state and editing surface."
                                >
                                    <div className="overflow-hidden border border-border bg-white">
                                        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/35 px-3 py-2">
                                            {['B', 'I', 'U', 'H2', 'H3'].map((item, index) => (
                                                <button
                                                    key={item}
                                                    className={cn(
                                                        'h-7 min-w-7 border border-transparent px-2 text-xs font-semibold transition-colors',
                                                        index === 0
                                                            ? 'border-primary/20 bg-primary/8 text-primary'
                                                            : 'text-muted-foreground hover:border-border hover:bg-white',
                                                    )}
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                            <div className="mx-1 h-5 w-px bg-border" />
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                aria-label="Insert link"
                                            >
                                                <Link2 className="size-4" />
                                            </Button>
                                        </div>
                                        <div className="min-h-44 px-4 py-4 text-sm leading-7 text-foreground">
                                            <h3 className="text-lg font-semibold tracking-[-0.04em]">
                                                What we do
                                            </h3>
                                            <p className="mt-3 text-muted-foreground">
                                                We build clean, direct content surfaces that help
                                                clients edit with confidence and publish without
                                                second guessing the workflow.
                                            </p>
                                        </div>
                                    </div>
                                </FocusField>

                                <FocusField
                                    label="Hero image"
                                    help="Upload workflow is future scope."
                                >
                                    <div className="flex items-start gap-3 border border-dashed border-border bg-muted/30 p-4">
                                        <ImageIcon className="mt-1 size-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">
                                                Image uploads coming soon
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Current URL preview appears here when present.
                                            </p>
                                        </div>
                                    </div>
                                </FocusField>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <SectionHeader
                            eyebrow="03 Controls"
                            title="Buttons, switches, and statuses"
                        >
                            Controls stay compact and clear. Draft/publish state is staged before
                            save.
                        </SectionHeader>

                        <div className="border border-border bg-white">
                            <CommandStrip label="Save cluster" status="Dirty changes present" />
                            <div className="space-y-5 px-5 py-5">
                                <div className="flex flex-wrap gap-2">
                                    <Button className="gap-2">
                                        <Save className="size-4" />
                                        Save changes
                                    </Button>
                                    <Button variant="outline" className="gap-2">
                                        <Eye className="size-4" />
                                        Preview
                                    </Button>
                                    <Button variant="ghost" className="gap-2">
                                        <Settings2 className="size-4" />
                                        Settings
                                    </Button>
                                    <Button disabled className="gap-2">
                                        <Clock3 className="size-4" />
                                        Saving
                                    </Button>
                                </div>

                                <div className="grid gap-3 border-t border-border pt-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">
                                                Published
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Staged on next save
                                            </p>
                                        </div>
                                        <Switch
                                            checked={published}
                                            onCheckedChange={setPublished}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">
                                                Notify editor
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Playground interaction state
                                            </p>
                                        </div>
                                        <Switch checked={notify} onCheckedChange={setNotify} />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                                    <StatusBadge tone="primary">Dirty</StatusBadge>
                                    <StatusBadge tone="success">Saved</StatusBadge>
                                    <StatusBadge tone="warning">Draft</StatusBadge>
                                    <StatusBadge tone="destructive">Error</StatusBadge>
                                    <StatusBadge>Disabled</StatusBadge>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,0.58fr)_minmax(360px,0.42fr)]">
                    <div className="space-y-5">
                        <SectionHeader eyebrow="04 Content Rows" title="Page library row pattern">
                            Library surfaces use rows for scanning status, route, and recent
                            changes.
                        </SectionHeader>

                        <div className="overflow-hidden border border-border bg-white">
                            <div className="grid gap-4 px-4 py-4 md:grid-cols-[48px_minmax(0,1fr)_140px_120px_28px]">
                                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    No.
                                </p>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    Page
                                </p>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    Status
                                </p>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    Updated
                                </p>
                            </div>
                            {pageRows.map((page, index) => (
                                <PageRow key={page.title} page={page} index={index} />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-5">
                        <SectionHeader eyebrow="05 States" title="Reusable feedback language">
                            Empty, loading, error, and saved states stay direct and compact.
                        </SectionHeader>

                        <div className="overflow-hidden border border-border bg-white">
                            {stateExamples.map((state) => (
                                <StateBlock key={state.label} state={state} />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,0.55fr)_minmax(360px,0.45fr)]">
                    <div className="space-y-5">
                        <SectionHeader eyebrow="06 Inspector" title="Drawer and side-panel pattern">
                            Inspector sections carry operational metadata without crowding the form.
                        </SectionHeader>
                        <InspectorPanel />
                    </div>

                    <div className="space-y-5">
                        <SectionHeader eyebrow="07 Typography" title="Scale and spacing rhythm">
                            Dashboard type stays sans, compact, and deliberate.
                        </SectionHeader>
                        <div className="border border-border bg-white p-5 md:p-7">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                        Display
                                    </p>
                                    <p className="mt-2 text-5xl font-semibold leading-none tracking-[-0.075em] text-foreground">
                                        Editing surface
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                        Section
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold tracking-[-0.055em] text-foreground">
                                        Content settings
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                        Body
                                    </p>
                                    <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
                                        The CMS should feel calm enough for a client editor and
                                        precise enough for repeated production work.
                                    </p>
                                </div>
                                <div className="grid gap-3 border-t border-border pt-5 sm:grid-cols-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Type className="size-4 text-primary" />
                                        Tight headings
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Search className="size-4 text-primary" />
                                        Clear scan labels
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <PanelRight className="size-4 text-primary" />
                                        Side metadata
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Layers3 className="size-4 text-primary" />
                                        Structured states
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border border-border bg-white">
                    <CommandStrip label="Toast and notice placement" status="Bottom-right stack" />
                    <div className="grid gap-4 p-5 md:grid-cols-3 md:p-6">
                        <div className="border-l-2 border-success bg-success/6 px-4 py-3">
                            <p className="text-sm font-semibold text-foreground">Saved</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Page content and status were updated.
                            </p>
                        </div>
                        <div className="border-l-2 border-warning bg-warning/8 px-4 py-3">
                            <p className="text-sm font-semibold text-foreground">Unsaved changes</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Save or discard changes before leaving.
                            </p>
                        </div>
                        <div className="border-l-2 border-destructive bg-destructive/6 px-4 py-3">
                            <p className="text-sm font-semibold text-foreground">Unable to save</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                The API message appears here with a retry path.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="h-8" />
            </main>

            <div className="sticky bottom-0 border-t border-border bg-white/92 px-5 py-3 backdrop-blur md:hidden">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Dirty changes</p>
                        <p className="text-xs text-muted-foreground">Mobile save bar pattern</p>
                    </div>
                    <Button className="gap-2">
                        <Save className="size-4" />
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
}

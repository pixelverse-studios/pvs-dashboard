'use client'

import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
} from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import {
    Bold,
    Heading2,
    Heading3,
    Italic,
    Link2,
    List,
    ListOrdered,
    Quote,
    RemoveFormatting,
    Underline as UnderlineIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface RichTextEditorHandle {
    focus: () => void
}

interface RichTextEditorProps {
    value: string
    onChange: (html: string) => void
    placeholder?: string
    disabled?: boolean
}

interface ToolbarAction {
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    isActive: () => boolean
    onClick: () => void
}

const emptyHtmlValues = new Set([
    '',
    '<p></p>',
    '<p><br></p>',
])

const normalizeEditorHtml = (html: string) => {
    const trimmed = html.trim()

    if (emptyHtmlValues.has(trimmed)) {
        return ''
    }

    return trimmed
}

const normalizeLinkUrl = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return null

    try {
        const candidate = /^(https?:)?\/\//i.test(trimmed)
            ? trimmed
            : `https://${trimmed}`
        const url = new URL(candidate)

        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return null
        }

        return url.toString()
    } catch {
        return null
    }
}

export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
    function RichTextEditor(
        {
            value,
            onChange,
            placeholder = 'Start writing…',
            disabled = false,
        },
        ref,
    ) {
        const [linkOpen, setLinkOpen] = useState(false)
        const [linkValue, setLinkValue] = useState('')
        const [linkError, setLinkError] = useState<string | null>(null)

        const editor = useEditor({
            immediatelyRender: false,
            editable: !disabled,
            extensions: [
                StarterKit.configure({
                    heading: {
                        levels: [2, 3],
                    },
                    strike: false,
                    codeBlock: false,
                    horizontalRule: false,
                }),
                Underline,
                Link.configure({
                    openOnClick: false,
                    autolink: false,
                    HTMLAttributes: {
                        rel: 'noopener noreferrer',
                        target: '_blank',
                    },
                }),
            ],
            content: value || '',
            editorProps: {
                attributes: {
                    class:
                        'rich-text-editor__content min-h-[220px] px-4 py-4 text-sm leading-7 text-foreground outline-none',
                },
                handlePaste(view, event) {
                    const text = event.clipboardData?.getData('text/plain')
                    if (typeof text !== 'string') {
                        return false
                    }

                    event.preventDefault()
                    view.dispatch(view.state.tr.insertText(text))
                    return true
                },
            },
            onUpdate({ editor: currentEditor }) {
                onChange(normalizeEditorHtml(currentEditor.getHTML()))
            },
        })

        useImperativeHandle(ref, () => ({
            focus: () => {
                editor?.commands.focus()
            },
        }), [editor])

        useEffect(() => {
            if (!editor) return
            editor.setEditable(!disabled)
        }, [disabled, editor])

        useEffect(() => {
            if (!editor) return

            const normalizedIncoming = normalizeEditorHtml(value || '')
            const normalizedCurrent = normalizeEditorHtml(editor.getHTML())

            if (normalizedIncoming === normalizedCurrent) {
                return
            }

            editor.commands.setContent(value || '', {
                emitUpdate: false,
            })
        }, [editor, value])

        const toolbarActions = useMemo<ToolbarAction[]>(() => {
            if (!editor) return []

            return [
                {
                    id: 'bold',
                    label: 'Bold',
                    icon: Bold,
                    isActive: () => editor.isActive('bold'),
                    onClick: () => editor.chain().focus().toggleBold().run(),
                },
                {
                    id: 'italic',
                    label: 'Italic',
                    icon: Italic,
                    isActive: () => editor.isActive('italic'),
                    onClick: () => editor.chain().focus().toggleItalic().run(),
                },
                {
                    id: 'underline',
                    label: 'Underline',
                    icon: UnderlineIcon,
                    isActive: () => editor.isActive('underline'),
                    onClick: () => editor.chain().focus().toggleUnderline().run(),
                },
                {
                    id: 'h2',
                    label: 'Heading 2',
                    icon: Heading2,
                    isActive: () => editor.isActive('heading', { level: 2 }),
                    onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
                },
                {
                    id: 'h3',
                    label: 'Heading 3',
                    icon: Heading3,
                    isActive: () => editor.isActive('heading', { level: 3 }),
                    onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
                },
                {
                    id: 'bulletList',
                    label: 'Bulleted list',
                    icon: List,
                    isActive: () => editor.isActive('bulletList'),
                    onClick: () => editor.chain().focus().toggleBulletList().run(),
                },
                {
                    id: 'orderedList',
                    label: 'Numbered list',
                    icon: ListOrdered,
                    isActive: () => editor.isActive('orderedList'),
                    onClick: () => editor.chain().focus().toggleOrderedList().run(),
                },
                {
                    id: 'blockquote',
                    label: 'Blockquote',
                    icon: Quote,
                    isActive: () => editor.isActive('blockquote'),
                    onClick: () => editor.chain().focus().toggleBlockquote().run(),
                },
            ]
        }, [editor])

        const applyLink = () => {
            if (!editor) return

            const normalized = normalizeLinkUrl(linkValue)
            if (!normalized) {
                setLinkError('Enter a valid URL.')
                return
            }

            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({
                    href: normalized,
                    rel: 'noopener noreferrer',
                    target: '_blank',
                })
                .run()

            setLinkOpen(false)
            setLinkError(null)
        }

        const removeLink = () => {
            if (!editor) return

            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            setLinkOpen(false)
            setLinkValue('')
            setLinkError(null)
        }

        const handleLinkOpenChange = (nextOpen: boolean) => {
            if (nextOpen) {
                const activeHref = editor?.getAttributes('link').href
                setLinkValue(typeof activeHref === 'string' ? activeHref : '')
                setLinkError(null)
            }

            setLinkOpen(nextOpen)
        }

        return (
            <div
                className={cn(
                    'overflow-hidden rounded-[1rem] border border-border/80 bg-white shadow-[0_18px_44px_-38px_rgba(17,17,17,0.32)]',
                    disabled && 'bg-muted/30',
                )}
            >
                <div className="sticky top-0 z-10 border-b border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,250,252,0.96))] px-3 py-3 backdrop-blur supports-backdrop-filter:bg-white/90">
                    <div className="flex flex-wrap items-center gap-1.5">
                        {toolbarActions.map((action) => {
                            const Icon = action.icon
                            const active = action.isActive()

                            return (
                                <Button
                                    key={action.id}
                                    type="button"
                                    variant={active ? 'secondary' : 'ghost'}
                                    size="icon-sm"
                                    aria-pressed={active}
                                    aria-label={action.label}
                                    title={action.label}
                                    disabled={disabled || !editor}
                                    onClick={action.onClick}
                                    className={cn(
                                        'rounded-[0.8rem] border border-transparent',
                                        active &&
                                            'border-primary/15 bg-primary/8 text-primary hover:bg-primary/12',
                                    )}
                                >
                                    <Icon className="size-4" />
                                </Button>
                            )
                        })}

                        <div className="mx-1 h-5 w-px bg-border/80" />

                        <Popover
                            open={linkOpen}
                            onOpenChange={handleLinkOpenChange}
                        >
                            <PopoverTrigger
                                render={
                                    <Button
                                        type="button"
                                        variant={editor?.isActive('link') ? 'secondary' : 'ghost'}
                                        size="icon-sm"
                                        aria-pressed={editor?.isActive('link') || false}
                                        aria-label="Insert link"
                                        title="Insert link"
                                        disabled={disabled || !editor}
                                        className={cn(
                                            'rounded-[0.8rem] border border-transparent',
                                            editor?.isActive('link') &&
                                                'border-primary/15 bg-primary/8 text-primary hover:bg-primary/12',
                                        )}
                                    />
                                }
                            >
                                <Link2 className="size-4" />
                            </PopoverTrigger>
                            <PopoverContent
                                align="start"
                                className="space-y-3"
                            >
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">
                                        Link URL
                                    </p>
                                    <p className="text-xs leading-5 text-muted-foreground">
                                        Insert a secure link that opens in a new tab.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <input
                                        value={linkValue}
                                        onChange={(event) => {
                                            setLinkValue(event.target.value)
                                            if (linkError) setLinkError(null)
                                        }}
                                        placeholder="https://example.com"
                                        className="h-10 w-full rounded-[0.85rem] border border-border bg-background px-3 text-sm outline-none transition focus:border-ring"
                                    />
                                    {linkError ? (
                                        <p className="text-xs text-destructive">
                                            {linkError}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={removeLink}
                                        disabled={disabled || !editor?.isActive('link')}
                                        className="gap-2"
                                    >
                                        <RemoveFormatting className="size-4" />
                                        Remove
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={applyLink}
                                    >
                                        Insert
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div
                    className={cn(
                        'relative min-h-[220px] bg-white',
                        disabled && 'cursor-not-allowed bg-muted/20 text-muted-foreground',
                    )}
                >
                    {editor?.isEmpty ? (
                        <div className="pointer-events-none absolute inset-x-4 top-4 text-sm text-muted-foreground">
                            {placeholder}
                        </div>
                    ) : null}
                    <EditorContent editor={editor} />
                </div>
            </div>
        )
    },
)

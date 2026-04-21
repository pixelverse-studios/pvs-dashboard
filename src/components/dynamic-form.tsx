'use client'

import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
} from 'react'
import {
    Controller,
    FormProvider,
    useForm,
    useFormContext,
    type DefaultValues,
    type FieldErrors,
} from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TriangleAlert, ImageIcon } from 'lucide-react'
import { RichTextEditor } from '@/components/rich-text-editor'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { CmsTemplate, CmsTemplateField } from '@/types/cms-template'
import { cn } from '@/lib/utils'

type DynamicFormValues = Record<string, unknown>

export interface DynamicFormHandle {
    submit: () => void
}

export interface DynamicFormProps {
    template: CmsTemplate
    initialValues: Record<string, unknown>
    onSubmit: (values: Record<string, unknown>) => Promise<void>
    onDirtyChange?: (isDirty: boolean) => void
    disabled?: boolean
}

// We keep the form ownership inside this component so the parent can stay focused on page-level actions.
// The parent passes onSubmit and dirty handlers, while the renderer handles schema generation and field wiring.
const buildFieldSchema = (field: CmsTemplateField) => {
    switch (field.type) {
        case 'text':
        case 'textarea':
        case 'rich_text': {
            let schema = z.string()

            if (field.required) {
                schema = schema.trim().min(1, 'Required')
            }

            if (field.max_length) {
                schema = schema.max(field.max_length, `Must be ${field.max_length} characters or less`)
            }

            return field.required ? schema : z.string().optional().default('')
        }
        case 'boolean':
            return field.required
                ? z.boolean({
                    error: 'Required',
                })
                : z.boolean().optional()
        case 'image':
            return z.string().optional()
        default:
            return z.any().optional()
    }
}

export const buildZodSchemaFromTemplate = (template: CmsTemplate) => {
    const shape: Record<string, z.ZodTypeAny> = {}

    for (const field of template.fields) {
        shape[field.key] = buildFieldSchema(field)
    }

    return z.object(shape)
}

const buildFieldId = (templateId: string, fieldKey: string) =>
    `${templateId}-${fieldKey}`

const getDefaultValues = (
    template: CmsTemplate,
    initialValues: Record<string, unknown>,
): DefaultValues<DynamicFormValues> => {
    return template.fields.reduce<DefaultValues<DynamicFormValues>>((acc, field) => {
        const existing = initialValues[field.key]

        if (field.type === 'boolean') {
            acc[field.key] = typeof existing === 'boolean' ? existing : false
            return acc
        }

        acc[field.key] = typeof existing === 'string' ? existing : ''
        return acc
    }, {})
}

const getFieldError = (
    errors: FieldErrors<DynamicFormValues>,
    key: string,
) => {
    const error = errors[key]
    if (!error) return null

    return typeof error.message === 'string' ? error.message : 'Invalid value'
}

const FieldShell = ({
    field,
    error,
    htmlFor,
    children,
}: {
    field: CmsTemplateField
    error?: string | null
    htmlFor?: string
    children: React.ReactNode
}) => (
    <div className="space-y-2.5">
        <div className="space-y-1">
            <label
                htmlFor={htmlFor}
                className="text-sm font-medium text-foreground"
            >
                {field.label}
                {field.required ? (
                    <span className="ml-1 text-destructive">*</span>
                ) : null}
            </label>
            {field.help ? (
                <p className="text-sm leading-6 text-muted-foreground">
                    {field.help}
                </p>
            ) : null}
        </div>
        {children}
        {error ? (
            <p className="text-sm text-destructive">{error}</p>
        ) : null}
    </div>
)

const UnsupportedField = ({
    field,
}: {
    field: CmsTemplateField
}) => (
    <Card className="border border-amber-200 bg-amber-50/70 shadow-none">
        <CardContent className="flex items-start gap-3 px-4 py-4">
            <div className="rounded-[0.8rem] bg-amber-100 p-2 text-amber-700">
                <TriangleAlert className="size-4" />
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                    Unsupported field type: {field.type}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                    Contact your developer. This field will not crash the form,
                    but it cannot be edited yet.
                </p>
            </div>
        </CardContent>
    </Card>
)

const ImagePlaceholderField = ({
    field,
    value,
}: {
    field: CmsTemplateField
    value: string
}) => (
    <FieldShell field={field}>
        <div className="rounded-[1rem] border border-dashed border-border/90 bg-[#fbfbfd] p-4">
            <div className="flex items-start gap-3">
                <div className="rounded-[0.85rem] bg-muted p-2 text-muted-foreground">
                    <ImageIcon className="size-4" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                        Image uploads coming soon
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                        Tracked in the image-gallery milestone.
                    </p>
                    {value ? (
                        <p className="break-all text-sm text-foreground">
                            Current URL: {value}
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    </FieldShell>
)

const DynamicFormFields = ({
    template,
    disabled = false,
}: {
    template: CmsTemplate
    disabled?: boolean
}) => {
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext<DynamicFormValues>()

    return (
        <div className="space-y-6">
            {template.fields.map((field) => {
                const error = getFieldError(errors, field.key)
                const fieldId = buildFieldId(template.id, field.key)

                if (field.type === 'text') {
                    return (
                        <FieldShell
                            key={field.key}
                            field={field}
                            error={error}
                            htmlFor={fieldId}
                        >
                            <Input
                                {...register(field.key)}
                                id={fieldId}
                                disabled={disabled}
                                maxLength={field.max_length ?? undefined}
                            />
                        </FieldShell>
                    )
                }

                if (field.type === 'textarea') {
                    return (
                        <FieldShell
                            key={field.key}
                            field={field}
                            error={error}
                            htmlFor={fieldId}
                        >
                            <Textarea
                                {...register(field.key)}
                                id={fieldId}
                                disabled={disabled}
                                maxLength={field.max_length ?? undefined}
                            />
                        </FieldShell>
                    )
                }

                if (field.type === 'rich_text') {
                    return (
                        <Controller
                            key={field.key}
                            name={field.key}
                            control={control}
                            render={({ field: controllerField }) => (
                                <FieldShell
                                    field={field}
                                    error={error}
                                >
                                    <RichTextEditor
                                        value={typeof controllerField.value === 'string' ? controllerField.value : ''}
                                        onChange={controllerField.onChange}
                                        disabled={disabled}
                                        placeholder={field.help ?? `Write ${field.label.toLowerCase()}…`}
                                    />
                                </FieldShell>
                            )}
                        />
                    )
                }

                if (field.type === 'boolean') {
                    return (
                        <Controller
                            key={field.key}
                            name={field.key}
                            control={control}
                            render={({ field: controllerField }) => (
                                <FieldShell
                                    field={field}
                                    error={error}
                                >
                                    <div className="flex items-center justify-between rounded-[1rem] border border-border/80 bg-white px-4 py-3">
                                        <p className="text-sm text-muted-foreground">
                                            {controllerField.value ? 'Enabled' : 'Disabled'}
                                        </p>
                                        <Switch
                                            checked={!!controllerField.value}
                                            onCheckedChange={controllerField.onChange}
                                            disabled={disabled}
                                        />
                                    </div>
                                </FieldShell>
                            )}
                        />
                    )
                }

                if (field.type === 'image') {
                    return (
                        <Controller
                            key={field.key}
                            name={field.key}
                            control={control}
                            render={({ field: controllerField }) => (
                                <ImagePlaceholderField
                                    field={field}
                                    value={typeof controllerField.value === 'string' ? controllerField.value : ''}
                                />
                            )}
                        />
                    )
                }

                return (
                    <UnsupportedField
                        key={field.key}
                        field={field}
                    />
                )
            })}
        </div>
    )
}

export const DynamicForm = forwardRef<DynamicFormHandle, DynamicFormProps>(
    function DynamicForm(
        {
            template,
            initialValues,
            onSubmit,
            onDirtyChange,
            disabled = false,
        },
        ref,
    ) {
        const schema = useMemo(() => buildZodSchemaFromTemplate(template), [template])
        const defaultValues = useMemo(
            () => getDefaultValues(template, initialValues),
            [initialValues, template],
        )

        const methods = useForm<DynamicFormValues>({
            resolver: zodResolver(schema),
            defaultValues,
            mode: 'onBlur',
        })

        useImperativeHandle(ref, () => ({
            submit: () => {
                void methods.handleSubmit(async (values) => {
                    await onSubmit(values)
                    methods.reset(values)
                })()
            },
        }), [methods, onSubmit])

        useEffect(() => {
            methods.reset(defaultValues)
        }, [defaultValues, methods])

        useEffect(() => {
            onDirtyChange?.(methods.formState.isDirty)
        }, [methods.formState.isDirty, onDirtyChange])

        return (
            <FormProvider {...methods}>
                <form
                    className={cn('space-y-6', disabled && 'opacity-80')}
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <DynamicFormFields
                        template={template}
                        disabled={disabled}
                    />
                </form>
            </FormProvider>
        )
    },
)

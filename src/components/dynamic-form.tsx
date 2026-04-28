'use client'

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import {
    Controller,
    FormProvider,
    useForm,
    useFormContext,
    type DefaultValues,
    type FieldErrors,
    type Resolver,
} from 'react-hook-form'
import { z } from 'zod/v4'
import { TriangleAlert, ImageIcon } from 'lucide-react'
import { RichTextEditor } from '@/components/rich-text-editor'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { CmsTemplate, CmsTemplateField } from '@/types/cms-template'
import { cn } from '@/lib/utils'

type DynamicFormValues = Record<string, unknown>
type DynamicFormSchema = ReturnType<typeof buildZodSchemaFromTemplate>

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
                schema = schema.max(
                    field.max_length,
                    `Must be ${field.max_length} characters or less`,
                )
            }

            return field.required ? schema : schema.optional().default('')
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

const dynamicFormResolver =
    (schema: DynamicFormSchema): Resolver<DynamicFormValues> =>
    async (values) => {
        const result = await schema.safeParseAsync(values)

        if (result.success) {
            return {
                values: result.data,
                errors: {},
            }
        }

        return {
            values: {},
            errors: result.error.issues.reduce<FieldErrors<DynamicFormValues>>((acc, issue) => {
                const fieldKey = issue.path[0]

                if (typeof fieldKey !== 'string') {
                    return acc
                }

                acc[fieldKey] = {
                    type: issue.code,
                    message: issue.message,
                }

                return acc
            }, {}),
        }
    }

const buildFieldId = (templateId: string, fieldKey: string) => `${templateId}-${fieldKey}`

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

const getFormBaselineKey = (template: CmsTemplate, initialValues: Record<string, unknown>) => {
    const fields = template.fields.map((field) => ({
        key: field.key,
        type: field.type,
        required: !!field.required,
        max_length: field.max_length ?? null,
        value: initialValues[field.key] ?? null,
    }))

    return JSON.stringify({
        templateId: template.id,
        fields,
    })
}

const getFieldError = (errors: FieldErrors<DynamicFormValues>, key: string) => {
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
    <div
        className={cn(
            'group/field relative border-l-2 py-1 pl-5 transition-colors focus-within:border-primary',
            error ? 'border-destructive' : 'border-border',
        )}
    >
        <div className="mb-2 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
                <label htmlFor={htmlFor} className="text-sm font-semibold text-foreground">
                    {field.label}
                </label>
                <span
                    className={cn(
                        'inline-flex items-center border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]',
                        field.required
                            ? 'border-primary/20 bg-primary/6 text-primary'
                            : 'border-border bg-muted/45 text-muted-foreground',
                    )}
                >
                    {field.required ? 'Required' : 'Optional'}
                </span>
            </div>
            {field.help ? (
                <p className="text-sm leading-6 text-muted-foreground">{field.help}</p>
            ) : null}
        </div>
        {children}
        {error ? (
            <p className="mt-2 border-l-2 border-destructive bg-destructive/6 px-3 py-2 text-sm font-medium text-destructive">
                {error}
            </p>
        ) : null}
    </div>
)

const UnsupportedField = ({ field }: { field: CmsTemplateField }) => (
    <div className="border-l-2 border-warning bg-warning/8 px-4 py-4">
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center border border-warning/20 bg-warning/10 text-warning">
                <TriangleAlert className="size-4" />
            </div>
            <div className="min-w-0 space-y-1">
                <p className="text-sm font-semibold text-foreground">
                    Unsupported field type: {field.type}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                    Contact your developer. This field will not crash the form, but it cannot be
                    edited yet.
                </p>
            </div>
        </div>
    </div>
)

const ImagePlaceholderField = ({ field, value }: { field: CmsTemplateField; value: string }) => (
    <FieldShell field={field}>
        <div className="border border-dashed border-border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center border border-border bg-white text-muted-foreground">
                    <ImageIcon className="size-4" />
                </div>
                <div className="min-w-0 space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                        Image uploads coming soon
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                        Tracked in the image-gallery milestone.
                    </p>
                    {value ? (
                        <p className="break-all border-l-2 border-primary bg-primary/4 px-3 py-2 text-sm text-foreground">
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
                        <FieldShell key={field.key} field={field} error={error} htmlFor={fieldId}>
                            <Input
                                {...register(field.key)}
                                id={fieldId}
                                disabled={disabled}
                                maxLength={field.max_length ?? undefined}
                                aria-invalid={!!error}
                                className="rounded-none bg-white shadow-none focus-visible:border-primary focus-visible:ring-primary/15"
                            />
                        </FieldShell>
                    )
                }

                if (field.type === 'textarea') {
                    return (
                        <FieldShell key={field.key} field={field} error={error} htmlFor={fieldId}>
                            <Textarea
                                {...register(field.key)}
                                id={fieldId}
                                disabled={disabled}
                                maxLength={field.max_length ?? undefined}
                                aria-invalid={!!error}
                                className="rounded-none bg-white shadow-none focus-visible:border-primary focus-visible:ring-primary/15"
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
                                <FieldShell field={field} error={error}>
                                    <RichTextEditor
                                        value={
                                            typeof controllerField.value === 'string'
                                                ? controllerField.value
                                                : ''
                                        }
                                        onChange={controllerField.onChange}
                                        disabled={disabled}
                                        invalid={!!error}
                                        placeholder={
                                            field.help ?? `Write ${field.label.toLowerCase()}...`
                                        }
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
                                <FieldShell field={field} error={error}>
                                    <div
                                        className={cn(
                                            'flex items-center justify-between border bg-white px-4 py-3',
                                            error ? 'border-destructive' : 'border-border',
                                        )}
                                    >
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
                                    value={
                                        typeof controllerField.value === 'string'
                                            ? controllerField.value
                                            : ''
                                    }
                                />
                            )}
                        />
                    )
                }

                return <UnsupportedField key={field.key} field={field} />
            })}
        </div>
    )
}

export const DynamicForm = forwardRef<DynamicFormHandle, DynamicFormProps>(function DynamicForm(
    { template, initialValues, onSubmit, onDirtyChange, disabled = false },
    ref,
) {
    const defaultValues = getDefaultValues(template, initialValues)
    const baselineKey = getFormBaselineKey(template, initialValues)
    const latestDefaultValuesRef = useRef(defaultValues)
    const schema = useMemo(() => buildZodSchemaFromTemplate(template), [template])
    const resolver = useMemo(() => dynamicFormResolver(schema), [schema])

    const methods = useForm<DynamicFormValues>({
        resolver,
        defaultValues,
        mode: 'onBlur',
    })

    useImperativeHandle(
        ref,
        () => ({
            submit: () => {
                void methods.handleSubmit(async (values) => {
                    await onSubmit(values)
                    methods.reset(values)
                })()
            },
        }),
        [methods, onSubmit],
    )

    useEffect(() => {
        latestDefaultValuesRef.current = defaultValues
    }, [defaultValues])

    useEffect(() => {
        methods.reset(latestDefaultValuesRef.current)
    }, [baselineKey, methods])

    useEffect(() => {
        onDirtyChange?.(methods.formState.isDirty)
    }, [methods.formState.isDirty, onDirtyChange])

    return (
        <FormProvider {...methods}>
            <form
                className={cn('space-y-6', disabled && 'opacity-80')}
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                <DynamicFormFields template={template} disabled={disabled} />
            </form>
        </FormProvider>
    )
})

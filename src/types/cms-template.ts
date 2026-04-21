export type CmsTemplateFieldType =
    | 'text'
    | 'textarea'
    | 'rich_text'
    | 'boolean'
    | 'image'
    | (string & {})

export interface CmsTemplateField {
    key: string
    type: CmsTemplateFieldType
    label: string
    help?: string | null
    required?: boolean
    max_length?: number | null
}

export interface CmsTemplate {
    id: string
    label: string
    slug: string
    fields: CmsTemplateField[]
}

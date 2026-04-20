export interface CmsPageTemplateSummary {
    label: string | null
}

export interface CmsPageListItem {
    id: string
    slug: string
    status: string | null
    updated_at: string | null
    template: CmsPageTemplateSummary | null
}

export interface CmsPagesResponse {
    pages: CmsPageListItem[]
}

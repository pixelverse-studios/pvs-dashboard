import { apiClient } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import type { CmsPageListItem, CmsPagesResponse } from '@/types/cms-page'

interface RawCmsPage {
    id?: string
    page_id?: string
    slug?: string | null
    route?: string | null
    path?: string | null
    public_path?: string | null
    status?: string | null
    updated_at?: string | null
    updatedAt?: string | null
    template?:
        | {
              label?: string | null
          }
        | null
    template_label?: string | null
}

interface RawCmsPagesResponse {
    pages?: RawCmsPage[]
}

const normalizePage = (page: RawCmsPage): CmsPageListItem => ({
    id: page.id ?? page.page_id ?? '',
    slug: page.slug ?? '',
    route:
        page.route ??
        page.path ??
        page.public_path ??
        (page.slug ? `/${page.slug}` : ''),
    status: page.status ?? null,
    updated_at: page.updated_at ?? page.updatedAt ?? null,
    template: {
        label: page.template?.label ?? page.template_label ?? null,
    },
})

export const listPagesForClient = async (
    clientId: string,
): Promise<CmsPagesResponse> => {
    const response = await apiClient.get<RawCmsPagesResponse | RawCmsPage[]>(
        apiPaths.clientPages(clientId),
    )

    const pages = Array.isArray(response)
        ? response
        : Array.isArray(response.pages)
          ? response.pages
          : []

    return {
        pages: pages
            .map(normalizePage)
            .filter((page) => page.id && (page.slug || page.route)),
    }
}

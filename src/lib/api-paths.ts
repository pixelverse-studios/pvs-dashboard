const p = (segment: string) => encodeURIComponent(segment)

export const apiPaths = {
    me: '/api/cms/me',
    resolveHostname: (hostname: string) =>
        `/api/cms/resolve-hostname?hostname=${encodeURIComponent(hostname)}`,
    clientUsers: (clientId: string) => `/api/cms/clients/${p(clientId)}/users`,
    userById: (id: string) => `/api/cms/users/${p(id)}`,
    clientTemplates: (clientId: string) => `/api/cms/clients/${p(clientId)}/templates`,
    templateById: (id: string) => `/api/cms/templates/${p(id)}`,
    clientPages: (clientId: string) => `/api/cms/clients/${p(clientId)}/pages`,
    pageById: (id: string) => `/api/cms/pages/${p(id)}`,
    publishPage: (id: string) => `/api/cms/pages/${p(id)}/publish`,
    publishedPage: (clientId: string, slug: string) =>
        `/api/cms/clients/${p(clientId)}/pages/${p(slug)}/published`,
    presignUpload: (websiteId: string) => `/api/cms/websites/${p(websiteId)}/upload/presign`,
    deleteUpload: (websiteId: string) => `/api/cms/websites/${p(websiteId)}/upload`,
} as const

export const apiPaths = {
    me: '/api/cms/me',
    resolveHostname: (hostname: string) =>
        `/api/cms/resolve-hostname?hostname=${encodeURIComponent(hostname)}`,
    clientUsers: (clientId: string) => `/api/cms/clients/${clientId}/users`,
    userById: (id: string) => `/api/cms/users/${id}`,
    clientTemplates: (clientId: string) => `/api/cms/clients/${clientId}/templates`,
    templateById: (id: string) => `/api/cms/templates/${id}`,
    clientPages: (clientId: string) => `/api/cms/clients/${clientId}/pages`,
    pageById: (id: string) => `/api/cms/pages/${id}`,
    publishPage: (id: string) => `/api/cms/pages/${id}/publish`,
    publishedPage: (clientId: string, slug: string) =>
        `/api/cms/clients/${clientId}/pages/${slug}/published`,
    presignUpload: (websiteId: string) => `/api/cms/websites/${websiteId}/upload/presign`,
    deleteUpload: (websiteId: string) => `/api/cms/websites/${websiteId}/upload`,
} as const

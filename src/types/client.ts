export interface ClientSummary {
    id: string
    firstname: string | null
    lastname: string | null
    company_name: string | null
}

export interface ClientListWebsite {
    website_id: string
    website_title: string | null
    domain: string | null
    status?: string | null
    priority?: number | null
}

export interface ClientListItem {
    client_id: string
    firstname: string | null
    lastname: string | null
    company_name: string | null
    website_count?: number | null
    websites?: ClientListWebsite[]
}

export interface ClientsResponse {
    total: number
    limit: number
    offset: number
    clients: ClientListItem[]
}

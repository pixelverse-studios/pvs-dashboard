export interface ClientSummary {
    id: string
    firstname: string | null
    lastname: string | null
    company_name: string | null
}

export interface ClientListItem {
    client_id: string
    firstname: string | null
    lastname: string | null
    company_name: string | null
    website_count?: number | null
}

export interface ClientsResponse {
    total: number
    limit: number
    offset: number
    clients: ClientListItem[]
}

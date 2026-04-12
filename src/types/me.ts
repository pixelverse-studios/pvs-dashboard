export type CmsRole = 'admin' | 'editor' | 'viewer'

export interface ClientAssignmentWebsite {
    id: string
    title: string | null
    domain: string | null
}

export interface ClientAssignment {
    id: string | null
    client_id: string
    role: CmsRole
    client: {
        id: string
        firstname: string | null
        lastname: string | null
        company_name: string | null
    }
    websites: ClientAssignmentWebsite[]
}

export interface MeResponse {
    user: {
        uid: string
        email: string
    }
    is_pvs_admin: boolean
    assignments: ClientAssignment[]
}

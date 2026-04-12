export interface BrandingConfig {
    logo_url: string | null
    favicon_url: string | null
    primary_color: string | null
    secondary_color: string | null
    accent_color: string | null
    font_family: string | null
    heading_font_family: string | null
}

export interface ResolvedWebsiteContext {
    website_id: string
    website_title: string | null
    client: {
        id: string
        firstname: string | null
        lastname: string | null
        company_name: string | null
    }
    branding: BrandingConfig | null
    purpose: 'dashboard' | 'production' | 'staging' | 'preview'
}

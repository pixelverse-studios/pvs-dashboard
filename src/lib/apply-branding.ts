import type { BrandingConfig } from '../types/branding'

const loadedFonts = new Set<string>()

const loadGoogleFont = (fontFamily: string) => {
    if (loadedFonts.has(fontFamily)) return
    loadedFonts.add(fontFamily)

    const encoded = encodeURIComponent(fontFamily)
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@400;500;600;700&display=swap`
    document.head.appendChild(link)
}

export const applyBranding = (branding: BrandingConfig | null) => {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    if (branding?.primary_color) {
        root.style.setProperty('--primary', branding.primary_color)
        root.style.setProperty('--ring', branding.primary_color)
    }
    if (branding?.secondary_color) {
        root.style.setProperty('--secondary', branding.secondary_color)
    }
    if (branding?.accent_color) {
        root.style.setProperty('--accent', branding.accent_color)
    }
    if (branding?.font_family) {
        loadGoogleFont(branding.font_family)
        root.style.setProperty(
            '--font-sans',
            `'${branding.font_family}', system-ui, sans-serif`,
        )
    }
    if (branding?.heading_font_family) {
        loadGoogleFont(branding.heading_font_family)
        root.style.setProperty(
            '--font-heading',
            `'${branding.heading_font_family}', system-ui, sans-serif`,
        )
    }

    if (branding?.favicon_url) {
        updateFavicon(branding.favicon_url)
    }
}

const updateFavicon = (url: string) => {
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']")
    if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
    }
    link.href = url
}

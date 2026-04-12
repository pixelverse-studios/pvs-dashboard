import type { BrandingConfig } from '../types/branding'

const HEX_COLOR = /^#[0-9a-f]{3,8}$/i
const SAFE_FONT_NAME = /^[a-zA-Z0-9\s\-]+$/

const loadedFonts = new Set<string>()

const loadGoogleFont = (fontFamily: string) => {
    if (!SAFE_FONT_NAME.test(fontFamily)) return
    if (loadedFonts.has(fontFamily)) return
    loadedFonts.add(fontFamily)

    const encoded = encodeURIComponent(fontFamily)
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@400;500;600;700&display=swap`
    document.head.appendChild(link)
}

const setColor = (root: HTMLElement, prop: string, value: string) => {
    if (HEX_COLOR.test(value)) {
        root.style.setProperty(prop, value)
    }
}

const setFont = (root: HTMLElement, prop: string, fontFamily: string) => {
    if (!SAFE_FONT_NAME.test(fontFamily)) return
    loadGoogleFont(fontFamily)
    root.style.setProperty(prop, `'${fontFamily}', system-ui, sans-serif`)
}

const BRANDED_PROPS = [
    '--primary',
    '--ring',
    '--secondary',
    '--accent',
    '--font-sans',
    '--font-heading',
] as const

export const applyBranding = (branding: BrandingConfig | null) => {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    if (branding?.primary_color) {
        setColor(root, '--primary', branding.primary_color)
        setColor(root, '--ring', branding.primary_color)
    }
    if (branding?.secondary_color) {
        setColor(root, '--secondary', branding.secondary_color)
    }
    if (branding?.accent_color) {
        setColor(root, '--accent', branding.accent_color)
    }
    if (branding?.font_family) {
        setFont(root, '--font-sans', branding.font_family)
    }
    if (branding?.heading_font_family) {
        setFont(root, '--font-heading', branding.heading_font_family)
    }

    if (branding?.favicon_url) {
        updateFavicon(branding.favicon_url)
    }
}

export const resetBranding = () => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    for (const prop of BRANDED_PROPS) {
        root.style.removeProperty(prop)
    }
}

const updateFavicon = (url: string) => {
    try {
        const parsed = new URL(url)
        if (parsed.protocol !== 'https:') return
    } catch {
        return
    }

    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']")
    if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
    }
    link.href = url
}

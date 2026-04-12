export class ApiError extends Error {
    readonly status: number
    readonly body: unknown

    constructor(status: number, body: unknown, message?: string) {
        super(message || `API error ${status}`)
        this.name = 'ApiError'
        this.status = status
        this.body = body
    }

    get isUnauthorized() {
        return this.status === 401
    }

    get isForbidden() {
        return this.status === 403
    }

    get isNotFound() {
        return this.status === 404
    }

    get isConflict() {
        return this.status === 409
    }

    get isRateLimited() {
        return this.status === 429
    }
}

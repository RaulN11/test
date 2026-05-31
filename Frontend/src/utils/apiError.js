
export async function extractErrorMessage(response) {
    try {
        const body = await response.json()
        if (body?.message) return body.message
        return `Request failed (${response.status})`
    } catch {
        return `Request failed (${response.status})`
    }
}
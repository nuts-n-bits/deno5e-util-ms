import { ParsedUrl, ServerRequest, Response } from "../dependencies/lib-compat.ts"

export async function app_404(req: ServerRequest, pu: ParsedUrl): Promise<Response> {

    return {
        status: 404,
        body: "HTTP 404"
    }
}
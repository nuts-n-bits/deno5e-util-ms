import { ServerRequest, Response } from "https://deno.land/std@0.88.0/http/server.ts"
import { Parsed_url } from "./parse-url.ts"

export async function app_404(req: ServerRequest, pu: Parsed_url): Promise<Response> {

    return {
        status: 404,
        body: "HTTP 404"
    }
}
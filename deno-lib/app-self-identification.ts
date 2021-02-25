import { ServerRequest, Response } from "https://deno.land/std@0.88.0/http/server.ts"
import { Parsed_url } from "./parse-url.ts"

export async function app_self_identification(req: ServerRequest, pu: Parsed_url): Promise<Response> {

    return {
        status: 200,
        body: "deno5e-util-ms"
    }
}
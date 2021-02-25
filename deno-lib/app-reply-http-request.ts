import { ServerRequest, Response } from "https://deno.land/std@0.88.0/http/server.ts"
import { Parsed_url } from "./parse-url.ts"

export async function app_reply_http_request(req: ServerRequest, pu: Parsed_url): Promise<Response> {

    const response_object = {
        parsed_url: pu,
        headers: [...req.headers.entries()],
        content_length: req.contentLength,
        method: req.method,
        protocol: [req.proto, req.protoMajor, req.protoMinor]
    }

    return {
        status: 200,
        body: JSON.stringify(response_object),
        headers: new Headers([
            ["Content-Type", "application/json"]
        ])
    }
}
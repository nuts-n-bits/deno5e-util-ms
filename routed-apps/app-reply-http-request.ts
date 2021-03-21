import { ParsedUrl, ServerRequest, Response } from "../dependencies/lib-compat.ts"

export async function app_reply_http_request(req: ServerRequest, pu: ParsedUrl): Promise<Response> {

    const response_object = {
        parsed_url: pu,
        headers: [...req.headers.entries()],
        content_length: req.contentLength,
        method: req.method,
        protocol: {
            string: req.proto,
            major: req.protoMajor,
            minor: req.protoMinor
        }
    }

    return {
        status: 200,
        body: JSON.stringify(response_object),
        headers: new Headers([
            ["Content-Type", "application/json"]
        ])
    }
}
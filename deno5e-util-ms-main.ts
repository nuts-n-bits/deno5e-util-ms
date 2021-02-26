import { serve, ServerRequest, Response } from "https://deno.land/std@0.88.0/http/server.ts"
import { parse_url, Parsed_url } from "./deno-lib/parse-url.ts"
import { app_sha_binding } from "./deno-lib/app-sha3binding.ts"
import { app_404 } from "./deno-lib/app-404.ts"
import { app_ack } from "./deno-lib/app-ack.ts"
import { app_reply_http_request } from "./deno-lib/app-reply-http-request.ts"
import { app_self_identification } from "./deno-lib/app-self-identification.ts"

const server = serve({ hostname: "0.0.0.0", port: 9100 })
console.log(`http server deno5e-util-ms is running. Come at http://localhost:9100/`)

const app_map = new Map<string, (req: ServerRequest, pu: Parsed_url) => Promise<Response>>()
app_map.set("sha", app_sha_binding)
app_map.set("self-identification", app_self_identification)
app_map.set("reply-request", app_reply_http_request)
app_map.set("ack", app_ack)

for await (const request of server) {
    let parsed_url: Parsed_url
    try {
        parsed_url = parse_url(request.url)
    }
    catch(e) {
        await request.respond({status: 400, body: "HTTP 400, malformed url"})
        break
    }
    const app = app_map.get(parsed_url.decoded_fragments[0]) || app_404
    try {
        const response = await app(request, parsed_url)
        await request.respond(response)
    }
    catch(e) {
        try {
            await request.respond({status: 500, body: (e as Error).stack})
        }
        catch(e) {
            console.error("Fallback request has botched")
        }
    }
}

    







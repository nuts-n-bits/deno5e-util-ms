import { serve, ServerRequest, Response } from "https://deno.land/std@0.88.0/http/server.ts"
import { parse_url, Parsed_url } from "./deno-lib/parse-url.ts"
import { app_sha3binding } from "./deno-lib/app-sha3binding.ts"
import { app_404 } from "./deno-lib/app-404.ts"
import { app_self_identification } from "./deno-lib/app-self-identification.ts"

const server = serve({ hostname: "0.0.0.0", port: 9100 })
console.log(`http server deno5e-util-ms running. Come at http://localhost:9100/`)

const app_map = new Map<string, (req: ServerRequest, pu: Parsed_url) => Promise<Response>>()
app_map.set("sha3", app_sha3binding)
app_map.set("self-identification", app_self_identification)

for await (const request of server) {
    const parsed_url = parse_url(request.url)
    const app = app_map.get(parsed_url.decoded_fragments[0]) || app_404
    try {
        const response = await app(request, parsed_url)
        request.respond(response)
    }
    catch(e) {
        request.respond({status: 500, body: (e as Error).stack})
    }
}





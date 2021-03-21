import { parse_url, ParsedUrl, ServerRequest, Response, serve } from "./dependencies/lib-compat.ts"
import { app_sha_binding } from "./routed-apps/app-sha3binding.ts"
import { app_404 } from "./routed-apps/app-404.ts"
import { app_ack } from "./routed-apps/app-ack.ts"
import { app_reply_http_request } from "./routed-apps/app-reply-http-request.ts"
const common_name_header = ["X-Endpoint-Common-Name", "deno5e-util-ms"]

const server = serve({ hostname: "0.0.0.0", port: 9100 })
console.log(`http server deno5e-util-ms is running. Come at http://localhost:9100/`)
async function register() {
    try {
        const res = await fetch(`http://localhost:9999/register?protocol=http&common-name=${common_name_header[1]}&host=localhost:9100`)
        if(res.status !== 200) { throw new Error("Discovery server not accepting registration!!!") } 
    }
    catch (e) {

    }
}
register()
setInterval(register, 60000)

const app_map = new Map<string, (req: ServerRequest, pu: ParsedUrl) => Promise<Response>>()
app_map.set("sha"                   , app_sha_binding           )
app_map.set("reply-request"         , app_reply_http_request    )
app_map.set("ack"                   , app_ack                   )

while (true) {
    try {
        for await (const request of server) {
            let parsed_url: ParsedUrl
            try {
                parsed_url = parse_url(request.url)
            }
            catch (parse_url_error) {
                await request.respond({status: 400, body: "HTTP 400, malformed url", headers: new Headers([common_name_header])})
                break
            }
            const app = app_map.get(parsed_url.decoded_fragments[0]) || app_404
            try {
                const response = await app(request, parsed_url)
                if(response.headers) { response.headers.set(common_name_header[0], common_name_header[1]) }
                else { response.headers = new Headers([common_name_header]) }
                await request.respond(response)
            }
            catch (endpoint_and_response_error) {
                try {
                    await request.respond({status: 500, body: (endpoint_and_response_error as Error).stack, headers: new Headers([common_name_header])})
                }
                catch (fallback_response_error) {
                    console.error("Fallback response has botched", fallback_response_error)
                }
            }
        }
    }
    catch (top_level_for_await_error) {
        console.log("swallowed error", top_level_for_await_error)
    }
}






import { ServerRequest, Response } from "https://deno.land/std@0.88.0/http/server.ts"
import { Parsed_url } from "./parse-url.ts"

export async function app_ack(req: ServerRequest, pu: Parsed_url): Promise<Response> {

    console.log("serving", pu.decoded_fragments[1])

    return {
        status: 200,
        body: pu.decoded_fragments[1]
    }
}

import { ParsedUrl, ServerRequest, Response } from "../dependencies/lib-compat.ts"

export async function app_ack(req: ServerRequest, pu: ParsedUrl): Promise<Response> {

    return {
        status: 200,
        body: pu.decoded_fragments[1]
    }
}
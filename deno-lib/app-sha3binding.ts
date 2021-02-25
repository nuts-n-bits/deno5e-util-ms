import { ServerRequest, Response } from "https://deno.land/std@0.88.0/http/server.ts"
import { Parsed_url } from "./parse-url.ts"
import { sha3_256 } from "../sha3towasm/pkg/sha3towasm.js"
import { json_shape_is } from "../../lib-nnbc/src/functions/json-shape-is.ts"

export async function app_sha3binding(req: ServerRequest, pu: Parsed_url): Promise<Response> {

    const preimage = JSON.parse(pu.decoded_query_map.get("preimage") ?? "null")
    
    console.log(sha3_256(new TextEncoder().encode("abc")))
    throw new Error("unimplemented!")
}

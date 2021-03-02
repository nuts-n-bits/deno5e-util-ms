import { ServerRequest, Response } from "https://deno.land/std@0.88.0/http/server.ts"
import { Parsed_url } from "./parse-url.ts"
import { sha3_256, sha3_512, sha1_160, sha2_256 } from "../sha3towasm/pkg/sha3towasm.js"
import { json_shape_is } from "../../lib-nnbc/src/functions/json-shape-is.ts"

export async function app_sha_binding(req: ServerRequest, pu: Parsed_url): Promise<Response> {

    let hash_function: (preim: Uint8Array) => Uint8Array
    let image: Uint8Array

    const preimage_utf8 = pu.decoded_query_map.get("preimage-utf8")
    const preimage_json = pu.decoded_query_map.get("preimage-json")
    const algorithm = pu.decoded_fragments[1]

    if(algorithm === "sha1") {
        hash_function = sha1_160
    }
    else if(algorithm === "sha256") {
        hash_function = sha2_256
    }
    else if(algorithm === "sha3-256") {
        hash_function = sha3_256
    }
    else if(algorithm === "sha3-512") {
        hash_function = sha3_512
    }
    else {
        return { status: 400, body: "HTTP 400, must specify algorithm to be used at second fragment: one of 'sha1', 'sha256', 'sha3-256', 'sha3-512'" }
    }

    if(preimage_utf8 !== undefined && preimage_json === undefined) {
        image = hash_function(new TextEncoder().encode(preimage_utf8))
    }
    else if(preimage_json !== undefined && preimage_utf8 === undefined) {
        const parsed_json = JSON.parse(preimage_json)
        if(!json_shape_is(parsed_json, [0])) { return { status: 400, body: "HTTP 400, bad json shape from &preimage-json query param" } }
        image = hash_function(new Uint8Array(parsed_json))
    }
    else {
        return { status: 400, body: "HTTP 400, must specify exactly one of &preimage-json or &preimage-utf8 query params. Otherwise, must use POST method and supply preimage in body." }
    }

    const response_type = pu.decoded_query_map.get("format")

    if (response_type === "raw") {
        return { status: 200, body: image }
    }
    else if (response_type === "json") {
        return { status: 200, body: JSON.stringify([...image]) }
    }
    else if (true || response_type === "hex") {
        const body: string = [...image].map(x => ("00"+x.toString(16)).slice(-2)).join("")
        return { status: 200, body }
    }
}

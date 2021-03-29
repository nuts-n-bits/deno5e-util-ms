
export type ParsedUrl = ReturnType<typeof parse_url>
type UrlDecoder = (input: string) => string
const defaultUrlDecoder: UrlDecoder = decodeURIComponent

/**
 * @param raw_url Uri string before decoding, starting with "/". Example: "/route/item?query=value"
 * @param decoder Decodes Uri components, default = decodeURIComponent
 * @returns A deep-frozen result object
 */
export function parse_url(raw_url: string, decoder = defaultUrlDecoder) {
    const query_pos = raw_url.indexOf("?")
    const before_query = query_pos < 0 ? raw_url : raw_url.substr(0, query_pos)
    const after_query = query_pos < 0 ? null : raw_url.substr(query_pos + 1)
    const decoded_fragments = Object.freeze(before_query.substr(1).split("/").map(decoder))
    const decoded_query_entries = Object.freeze(
        after_query === null ? [] : after_query.split("&").map(kv_pair => {
            const assignment_pos = kv_pair.indexOf("=")
            const before_assign = assignment_pos < 0 ? kv_pair : kv_pair.substr(0, assignment_pos)
            const after_assign = assignment_pos < 0 ? "" : kv_pair.substr(assignment_pos + 1)
            return Object.freeze([decoder(before_assign), decoder(after_assign)] as const)
        })
    )
    const decoded_query_map = Object.freeze(new Map(decoded_query_entries))
    
    return Object.freeze({
        before_query,
        after_query,
        decoded_fragments,
        decoded_query_entries,
        decoded_query_map,
    })
}

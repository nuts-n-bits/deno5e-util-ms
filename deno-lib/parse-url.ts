
export type Parsed_url = ReturnType<typeof parse_url>

export function parse_url(full_url: string) {
    const query_pos = full_url.indexOf("?")
    const before_query = query_pos < 0 ? full_url : full_url.substr(0, query_pos)
    const after_query = query_pos < 0 ? null : full_url.substr(query_pos + 1)
    const decoded_fragments = before_query.substr(1).split("/").map(decodeURIComponent)
    const decoded_query_entries = after_query === null ? [] : after_query.split("&").map(kv_pair => {
        const assignment_pos = kv_pair.indexOf("=")
        const before_assign = assignment_pos < 0 ? kv_pair : kv_pair.substr(0, assignment_pos)
        const after_assign = assignment_pos < 0 ? "" : kv_pair.substr(assignment_pos + 1)
        return [decodeURIComponent(before_assign), decodeURIComponent(after_assign)] as const
    })
    const decoded_query_map = new Map(decoded_query_entries)
    
    return {
        before_query,
        after_query,
        decoded_fragments,
        decoded_query_entries,
        decoded_query_map,
    }
}

// const Topological Data Analysis = "https://www.youtube.com/?q=Topological+data+analysis"
// const EEVDF = "earliest eligible virtual deadline first"

import { parse_url, ParsedUrl } from "../functions/parse-url"
import { Identify } from "../functions/identify"

import { HttpRequest } from "./http-interface-type"
import { assert_not_undefined } from "../protocols/assert-passthrough"

export { RoutingTable, DoubleRegistrationError, batch_registration } from "./routing-table"
export { TcpConnectionAction, HttpResponse, HttpRequest } from "./http-interface-type"
export class Context<BodyStreamType> {

    public  readonly time_of_admission      = Date.now()
    public  readonly url                    : string
    public  readonly pu                     : ParsedUrl
    public  readonly header_map             : Map<string, string[]>

    private readonly _identified_cookie     : Identify
    private readonly _remote_address        : string

    constructor (public request: HttpRequest<BodyStreamType>) {

        // parse cookie and client address
        this.header_map = repeatable_entry_to_map(request.headers)
        const first_cookie: string = this.header_map.get("cookie")?.[0] ?? ""  // if client header presents more than one Cookie entry, only care about the first.
        this._identified_cookie = new Identify(";", "=", "").set(first_cookie)
        this._remote_address = this.header_map.get("x-real-ip")?.[0] ?? request.tcp.remote_address
        this.url = request.url
        this.pu = parse_url(request.url)
    }

    cookie (name: string): string|null {
        return this._identified_cookie.first(name)
    }

    frgament (index: number): string|null {

        let array_len = this.pu.decoded_fragments.length

        if(index > array_len - 1) {

            return null
        }
        else if(index > -1) {

            return this.pu.decoded_fragments[index] ?? null
        }
        else if(index >= -array_len) {

            return this.pu.decoded_fragments[index + array_len] ?? null
        }
        else {

            return null
        }
    }

    query (key: string): string|null {
        return this.pu.decoded_query_map.get(key) ?? null
    }

    host (): string|null {  // "www.foo.com:4455"
        return this.header_map.get("host")?.[0] ?? null
    }

    host_length (): number {
        return this.host_stem() === null ? 0 : this.host_stem()!.split(".").length
    }

    host_parts(start: number = 0, length: number = 1): string|null {
        if(this.host() === null) { return null }
        const host_stem = this.host_stem()
        if(host_stem === null) { return null }
        let stems = host_stem.split(".")
        let max = stems.length - 1
        start = max - start
        let end = start - length + 1
        let desired_parts : Array<string> = []

        for(let i=start; i>=0 && i>=end && i<=max; i--) {
            const stems_i = stems[i]
            desired_parts.push(assert_not_undefined(stems_i))
        }

        return desired_parts.join(".")
    }

    host_stem (): string|null {  // if host is www.foo.com:4455, then host stem is www.foo.com
        return this.host() === null ? null : this.host()!.split(":")[0] ?? null
    }

    method (): string {
        return this.request.method
    }

    remote_address (): string {
        return this._remote_address
    }

    ua (): string|null {
        return this.header_map.get("user-agent")?.[0] ?? null
    }
}

function repeatable_entry_to_map (entries: [string, string][]): Map<string, string[]> {
    const map = new Map<string, string[]>()
    entries.forEach(entry => {
        const array = map.get(entry[0]) ?? []
        array.push(entry[1])
        map.set(entry[0], array)
    })
    return map
}
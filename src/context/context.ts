
// const Topological Data Analysis = "https://www.youtube.com/?q=Topological+data+analysis"
// const EEVDF = "earliest eligible virtual deadline first"

import { IncomingMessage, ServerResponse } from "http"
import { parse_url, ParsedUrl } from "../functions/parse-url"
import { Identify } from "../functions/identify"
import { App_finder } from "./find-app"

export class Context {

    public  readonly time_of_admission      = Date.now()
    public  readonly pu                     : ParsedUrl

    private readonly _identified_cookie     : Identify
    private readonly _remote_address        : string|string[]|null

    constructor (private req: IncomingMessage, private res: ServerResponse, public readonly routing_rule: App_finder<string|symbol, Function>) {

        // parse cookie and client address
        let first_cookie: string = ""  // if client header presents more than one Cookie entry, only care about the first.
        if (typeof req.headers.cookie === "string") { first_cookie = req.headers.cookie }
        else if (!req.headers.cookie) { first_cookie = "" }
        else { first_cookie = req.headers.cookie[0] || "" }
        this._identified_cookie = new Identify(";", "=", "").set(first_cookie)
        this._remote_address = req.headers["x-real-ip"] || req.connection.remoteAddress || null
        this.pu = parse_url(req.url||"/")
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

    host () {  // "www.foo.com:4455"
        return this.req.headers.host || null
    }

    host_length (): number {
        return this.host_stem() === null ? 0 : this.host_stem()!.split(".").length
    }

    host_parts(start : number = 0, length : number = 1) : string|null {
        if(this.host() === null)
            return null

        let stems = this.host_stem()!.split(".")
        let max = stems.length - 1
        start = max - start
        let end = start - length + 1
        let desired_parts : Array<string> = []

        for(let i=start; i>=0 && i>=end && i<=max; i--)
            desired_parts.push(stems[i])

        return desired_parts.join(".")
    }

    host_stem (): string|null {  // if host is www.foo.com:4455, then host stem is www.foo.com
        return this.host() === null ? null : this.host()!.split(":")[0]
    }

    method (): string|null {
        return this.req.method || null
    }

    remote_address (): string|null {
        if (typeof this._remote_address === "string") return this._remote_address
        else if (this._remote_address === null) { return null }
        else { return this._remote_address[0] || null }
    }

    request (): IncomingMessage {
        return this.req
    }

    response (): ServerResponse {
        return this.res
    }

    ua (): string|null {
        const raw : any = this.req.headers["user-agent"] || null
        if(raw instanceof Array) { return raw[0] || null }
        else { return raw }
    }

}

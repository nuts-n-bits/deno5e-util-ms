
// const Topological Data Analysis = "https://www.youtube.com/?q=Topological+data+analysis"
// const EEVDF = "earliest eligible virtual deadline first"

import { IncomingMessage, ServerResponse } from "http"
import { request_uri_handler } from "../functions/request-uri-handler"
import { Handled } from "../protocols/handled-uri"
import { Identify } from "../functions/identify"
import { App_finder } from "./find-app"
import { mlc } from "../functions/language-logics/best-fit-language-code"
import { Quick_queue } from "../functions/data-structure/quick-queue"

export class Context {

    public  readonly time_of_admission      : number = Date.now()
    public  readonly app_finder             : App_finder<string|symbol, Function>

    private          _app_chain             : Array<string> = []
    private readonly _identified_cookie     : Identify
    private readonly _handled_uri           : Handled
    private          _identified_query      : Identify
    private readonly _remote_address        : string|string[]|null
    private readonly _request               : IncomingMessage
    private readonly _response              : ServerResponse

    constructor (req : IncomingMessage, res : ServerResponse, routing_rule : App_finder<string|symbol, Function>) {

        // parse cookie and client address
        let first_cookie : string = ""  // if client header presents more than one Cookie entry, only care about the first.
        if (typeof req.headers.cookie === "string") { first_cookie = req.headers.cookie }
        else if (!req.headers.cookie) { first_cookie = "" }
        else { first_cookie = req.headers.cookie[0] || "" }
        this._identified_cookie = new Identify(";", "=", "").set(first_cookie)
        this._remote_address    = req.headers["x-real-ip"] || req.connection.remoteAddress || null

        this._request           = req
        this._response          = res
        this.app_finder         = routing_rule

        // handle uri, assign uri handler results.
        this._handled_uri       = request_uri_handler(decodeURI(req.url||"/"))
        this._identified_query  = new Identify("&", "=", "").set(this._handled_uri.query)
    }

    app_chain () : Array<string> {
        return this._app_chain
    }

    cookie (name : string) : string|null {
        return this._identified_cookie.first(name)
    }

    get (index : bigint) : string|null {

        let array_len = this._handled_uri.get_ordered.size()

        if(index > array_len - 1n) {

            return null
        }
        else if(index > -1n) {

            return this._handled_uri.get_ordered.peek(index)
        }
        else if(index >= -array_len) {

            return this._handled_uri.get_ordered.peek(index + array_len)
        }
        else {

            return null
        }
    }

    get_ordered () : Quick_queue<string> {
        return this._handled_uri.get_ordered
    }

    handled_uri () {
        return this._handled_uri
    }

    host () {  // "www.foo.com:4455"
        return this._request.headers.host || null
    }

    host_length () : number {
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

    host_stem () : string|null {  // if host is www.foo.com:4455, then host stem is www.foo.com
        return this.host() === null ? null : this.host()!.split(":")[0]
    }

    lang_code_header () : string|null {
        
        const header_lang = this._request.headers["accept-language"] || null

        const first_header_lang = header_lang ? header_lang.split(",")[0].split(";")[0].trim() : null

        return first_header_lang
    }

    method () : string|null {
        return this._request.method || null
    }

    /**
     * @param  key Is the key of a specific query segment.
     * @return     Returns query value of the corresponding key if found. Returns null otherwise.
     * Use query_entire if want the raw query.
     */
    query (key : string) : string|null {
        const try_find_query_item = this._identified_query.last(key)
        if (try_find_query_item === null) { return null }
        else { return decodeURIComponent(try_find_query_item) }
    }

    query_entire () : string {
        return this._handled_uri.query
    }

    remote_address () : string|null {
        if (typeof this._remote_address === "string") return this._remote_address
        else if (this._remote_address === null) { return null }
        else { return this._remote_address[0] || null }
    }

    request () : IncomingMessage {
        return this._request
    }

    response () : ServerResponse {
        return this._response
    }

    start_app_name () : string {
        return this._handled_uri.app
    }

    ua () : string|null {
        const raw : any = this._request.headers["user-agent"] || null
        if(raw instanceof Array) { return raw[0] || null }
        else { return raw }
    }

    uri () : string {
        return this._handled_uri.uri_sans_query
    }

}

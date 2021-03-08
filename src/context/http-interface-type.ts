export type HttpResponse = {
    status: number,
    headers?: [string, string][],
    body?: Uint8Array | string | ReadableStream,
    trailers?: () => Promise<[string, string][]>
}

export class TcpConnectionAction {
    constructor (
        public action: "end" | "destroy"
    ) {

    }
}

export type HttpRequest = {
    method: string,
    url: string,
    protocol: string,
    headers: [string, string][],
    body: ReadableStream,
    tcp: {
        remote_address: string,
    }
}
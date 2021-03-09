export type HttpResponse<BodyStreamType=ReadableStream> = {
    status: number,
    headers?: [string, string][],
    body?: Uint8Array | string | BodyStreamType,
    trailers?: () => Promise<[string, string][]>
}

export class TcpConnectionAction {
    constructor (public action: "end" | "destroy") {}
}

export type HttpRequest<BodyStreamType=ReadableStream> = {
    method: string,
    url: string,
    protocol: string,
    headers: [string, string][],
    body: BodyStreamType,
    tcp: { remote_address: string }
}
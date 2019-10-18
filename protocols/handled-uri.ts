import { Quick_queue } from "../functions/data-structure/quick-queue"

export type Handled = {
    app            : string
    get_ordered    : Quick_queue<string>
    query          : string
    uri_sans_query : string
}


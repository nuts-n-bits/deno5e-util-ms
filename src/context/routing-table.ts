export class DoubleRegistrationError extends Error {}

export class RoutingTable <TKey, TValue> {
    
    private map = new Map<TKey,RoutingTable<TKey,TValue>>()

    constructor(public readonly fallback: TValue) {}
    
    register(value: TValue, key: TKey, ...rest_key: TKey[]) {
        const rest_key_0 = rest_key[0]
        if(rest_key_0 === undefined) {
            const find_rt = this.map.get(key)
            if (find_rt) { throw new DoubleRegistrationError("Double registration error.") }
            else { this.map.set(key, create_child_table(this, value)) }
        }
        else {
            let find_rt
            for(find_rt = this.map.get(key); find_rt === undefined; ) {
                const implicit_layer = create_child_table(this, this.fallback)
                this.map.set(key, implicit_layer)
                find_rt = implicit_layer
            }
            find_rt.register(value, rest_key_0, ...rest_key.slice(1)) 
        }
    }

    lookup(keys: TKey[], start=0): {val: TValue, depth: number, unmatched: number, keys_used: number, continue: RoutingTable<TKey, TValue> } {
        const key_start = keys[start]
        if (key_start !== undefined) {
            const next_map = this.map.get(key_start)
            if(next_map !== undefined) { return next_map.lookup(keys, start+1) }
        }
        const depth = get_layer(this)
        return { val: this.fallback, depth: depth, unmatched: keys.length-depth, keys_used: start, continue: this }
    }

    layer(): number {
        return get_layer(this)
    }
}

const layer_number_tracker = new WeakMap<RoutingTable<any, any>, number>()
function get_layer(rt: RoutingTable<any, any>) {
    return layer_number_tracker.get(rt) ?? 0
}
function set_layer(rt: RoutingTable<any, any>, n: number) {
    return layer_number_tracker.set(rt, n)
}
function create_child_table<T,U>(parent: RoutingTable<T,U>, defaut: U) {
    const child = new RoutingTable<T,U>(defaut)
    const child_layer = get_layer(parent) + 1
    set_layer(child, child_layer)
    return child
}

// tests

// const send_frontend = Symbol("send frontend")
// const a = Symbol("api")
// const ap = Symbol("api/pb")
// const abc = Symbol("api/pb/create")
// const abd = Symbol("api/pb/delete")

// const rt = new RoutingTable<string, symbol>(send_frontend)
// rt.register( a    , "api"             )
// rt.register( ap   , "api" , "pb"      )
// rt.register( abc  , "api" , "pb" , "create")
// rt.register( abd  , "api" , "pb" , "delete")
// rt.register( a    , "api" , "server-errors"      )

// console.dir(rt, {depth: 100})

// console.log("api/pb/create/eee:", rt.lookup("api/pb/create/eee".split("/")))
// console.log("api/pb/create:", rt.lookup("api/pb/create".split("/")))
// console.log("api/pb/404",     rt.lookup("api/pb/404".split("/")))
// console.log("api/pb",     rt.lookup("api/pb".split("/")))
// console.log("api/404:" , rt.lookup("api/404".split("/")))
// console.log("api:" , rt.lookup("api".split("/")))
// console.log("l/o:" , rt.lookup("l/o".split("/")))

// const fb = Symbol()
// const ma = Symbol()

// const table = {
//     "projectuni.dev": {
//         [fb]: send_projuni_frontend,
//         "POST": {
//             [fb]: project_uni_api_docum,
//             "api": {
//                 [fb]: project_uni_api_docum,
//                 "ep1": project_uni_api_edpnt,
//             }
//         },
//         "GET": {
//             [fb]: send_projuni_frontend,
//             "api": {}
//         },
//         "DELETE": {
//             [fb]: project_uni_api_docum,
//             "api": {
//                 [fb]: project_uni_api_docum,
//                 "ep1": project_uni_api_edpnt,
//             }
//         },
//         "PUT": {
//             [fb]: project_uni_api_docum,
//             "api": {
//                 [fb]: project_uni_api_docum,
//                 "ep1": project_uni_api_edpnt,
//             }
//         },
//     }
// }
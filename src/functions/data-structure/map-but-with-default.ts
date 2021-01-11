export class Map_but_with_default<K, V> extends Map<K, V> {

    private default_value_factory: () => V

    constructor(default_value_factory: () => V)
    constructor(default_value_factory: () => V, iterable: Iterable<readonly [K, V]>)
    constructor(default_value_factory: () => V, entries?: readonly (readonly [K, V])[] | null | undefined)
    constructor(default_value_factory: () => V, it_ent?: readonly (readonly [K, V])[] | null | undefined | Iterable<readonly [K, V]>) {

        if (it_ent === null || it_ent === undefined) { super() }
        else { super(it_ent) }

        this.default_value_factory = default_value_factory
    }

    get(key: K): V {
        
        const try_get = super.get(key)
        if(try_get) {
            return try_get 
        }
        else {
            super.set(key, this.default_value_factory())
            return super.get(key)!
        }
    }
}
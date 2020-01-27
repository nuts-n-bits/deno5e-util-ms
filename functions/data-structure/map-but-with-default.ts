export class Map_but_with_default<K, V> extends Map<K, V> {

    private default_value : V

    constructor(default_value : V)
    constructor(default_value : V, iterable : Iterable<readonly [K, V]>)
    constructor(default_value : V, entries? : readonly (readonly [K, V])[] | null | undefined)
    constructor(default_value : V, it_ent? : readonly (readonly [K, V])[] | null | undefined | Iterable<readonly [K, V]>) {

        if (it_ent === null || it_ent === undefined) { super() }
        else { super(it_ent) }

        this.default_value = default_value

    }

    get(key : K) : V {
        return super.get(key) || this.default_value
    }
}

`

<displaytitle v="API Documentation" />
<redirect v="/API/documentation" />
<nosidebar />

`
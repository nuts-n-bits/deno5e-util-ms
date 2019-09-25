export class SymbolRegistryDoubleIdRegistrationError extends Error {}

export class SymbolRegistryDoubleNsNameRegistrationError extends Error {}

/*
*
* Examples.
*
* const reg = new Symbol_registry()
*
* reg.register(151n, "LP1", "Massachusetts Ave.")
* reg.look_up(151n) --> ["LP1", "Massachusetts Ave"]
* reg.look_up("LP1", "Massachusetts Ave") --> 151n
*
* reg.register(151n, "anything", "else") --> * double registration error *
* reg.register(152n, "LP1", "Massachusetts Ave") --> * double registration error *
*
*/
export class Symbol_registry {

    private readonly _name_namespace_by_id: Map<bigint, [string, string]> = new Map()
    private readonly _id_by_name_namespace: Map<string, Map<string, bigint>> = new Map()

    register(id: bigint, namespace: string, name: string) : this {

        // Double registration guard (2 if-throw guards)
        if (this._name_namespace_by_id.has(id))
            throw new SymbolRegistryDoubleIdRegistrationError()
        if (this._id_by_name_namespace.has(namespace) && this._id_by_name_namespace.get(namespace)!.has(name))
            throw new SymbolRegistryDoubleNsNameRegistrationError()

        this._name_namespace_by_id.set(id, [namespace, name])

        const namespaced_map = this._id_by_name_namespace.get(namespace) || new Map<string, bigint>()
        namespaced_map.set(name, id)
        this._id_by_name_namespace.set(namespace, namespaced_map)

        return this
    }

    look_up(id : bigint) : [string, string] | null
    look_up(namespace : string, name : string) : bigint | null
    look_up(arg1 : bigint|string, arg2? : string) {
        if(typeof arg1 === "bigint") return this.look_up_1(arg1)
        else return this.look_up_2(arg1, arg2!)
    }

    private look_up_1(id : bigint) : [string, string] | null {

        return this._name_namespace_by_id.get(id) || null
    }

    private look_up_2(namespace : string, name : string) : bigint | null {

        const namespace_map = this._id_by_name_namespace.get(namespace)
        if(namespace_map === undefined) return null
        const id = namespace_map.get(name)
        if(id === undefined) return null
        else return id
    }
}

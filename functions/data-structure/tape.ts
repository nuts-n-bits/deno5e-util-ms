
const overhead_constant = 20n
const placeholder = null
const placeholder_overhead_constant = 10n

export class Tape {

    public static readonly version = "2019.9.1"
    public readonly version = Tape.version

    private core_data_holder = new Map<string, string>()
    private k_queue : Array<string|null> = []
    private l_queue : Array<bigint> = []
    public  count : bigint = 0n
    public  available : bigint

    constructor(private length : bigint) {

        this.available = length
    }

    private drop_excessive(): void {

        while (this.available < 0 && this.k_queue.length > 0) {

            const drop_k = this.k_queue.pop()
            const drop_l = this.l_queue.pop()

            if (drop_k !== undefined && drop_k !== null && drop_l !== undefined && drop_l !== null) {

                this.core_data_holder.delete(drop_k)
                this.available += drop_l
                this.count -= 1n
            }
        }

    }
    
    estimate_item_size(k : string, v : string) : bigint {

        return BigInt(k.length) * 4n + BigInt(v.length) * 2n + overhead_constant
    }

    resize(new_length : bigint): void {

        const original_length = this.length
        const diff = new_length - original_length

        this.length = new_length
        this.available += diff

        this.drop_excessive()
    }

    record(k : string, v : string) : void {

        const est_length = this.estimate_item_size(k, v)

        if (est_length > this.length) { return }

        if (this.core_data_holder.has(k)) {

            const pos = this.k_queue.indexOf(k)
            const original_length = this.l_queue[pos]
            const diff = est_length - original_length

            this.l_queue[pos] = est_length
            this.available -= diff

            this.core_data_holder.set(k, v)

            this.read(k)  // brings the key into the front

        } else {

            this.available -= est_length
            this.count += 1n

            this.k_queue.unshift(k)
            this.l_queue.unshift(est_length)

            this.core_data_holder.set(k, v)
        }

        this.drop_excessive()
    }

    read(key : string) : string|null {

        const try_get = this.core_data_holder.get(key)

        if (!try_get) { return null }

        const pos = this.k_queue.indexOf(key)

        if (pos !== 0) {

            const k = this.k_queue[pos]
            const l = this.l_queue[pos]

            this.k_queue[pos] = placeholder
            this.l_queue[pos] = placeholder_overhead_constant

            this.k_queue.unshift(k)
            this.l_queue.unshift(l)

            this.available -= placeholder_overhead_constant
        }

        return try_get

    }

    exist(key : string) : boolean {

        return this.core_data_holder.has(key)
    }

    delete(key: string) : boolean {

        if (this.core_data_holder.has(key)) {

            const pos = this.k_queue.indexOf(key)

            const k = this.k_queue[pos]
            const l = this.l_queue[pos]

            this.k_queue[pos] = placeholder
            this.l_queue[pos] = placeholder_overhead_constant

            this.core_data_holder.delete(key)

            this.available += l - placeholder_overhead_constant

            return true

        } else {

            return false
        }
    }

    estimated_remaining_length() : bigint {

        return this.length - this.available
    }

}
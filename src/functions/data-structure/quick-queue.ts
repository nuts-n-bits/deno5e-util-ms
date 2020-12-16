
export class QuickQueueOutOfBoundsError extends Error {}

export class Quick_queue<T> {

    private core_data : Map<bigint, T> = new Map()
    private left_bound = 0n
    private right_bound = 0n

    size () : bigint {

        return this.right_bound - this.left_bound
    }

    push (item : T) : void {

        this.core_data.set(this.right_bound, item)
        this.right_bound ++
    }

    unshift (item : T) : void {

        this.left_bound --
        this.core_data.set(this.left_bound, item)
    }

    pop_peek () : T {

        if(this.size() <= 0) throw new QuickQueueOutOfBoundsError()
        return this.core_data.get(this.right_bound - 1n)!
    }

    shift_peek () : T {

        if(this.size() <= 0) throw new QuickQueueOutOfBoundsError()
        return this.core_data.get(this.left_bound)!
    }

    pop () : T {

        if(this.size() <= 0) throw new QuickQueueOutOfBoundsError()
        this.right_bound -= 1n
        const got = this.core_data.get(this.right_bound)!
        this.core_data.delete(this.right_bound)
        return got
    }

    shift () : T {

        if(this.size() <= 0) throw new QuickQueueOutOfBoundsError()
        const got = this.core_data.get(this.left_bound)!
        this.core_data.delete(this.left_bound)
        this.left_bound += 1n
        return got
    }

    peek (index : bigint) : T {

        if(index >= this.size() || index < 0) throw new QuickQueueOutOfBoundsError()
        return this.core_data.get(this.left_bound + index)!
    }

    change (index : bigint, item : T) : void {

        if(index >= this.size() || index < 0) throw new QuickQueueOutOfBoundsError()
        this.core_data.set(this.left_bound + index, item)
    }

    forEach (f: (value: T, key: bigint, map: Map<bigint, T>) => void) : void {

        this.core_data.forEach(f)
    }

    toString () : string {

        const arr : string[] = []

        for(let i=0n; i<this.size(); i++) {

            arr.push(String(this.peek(i)))
        }

        return "[" + arr.join(", ") + "]"
    }

    entries() {

        return this.core_data.entries
    }
}


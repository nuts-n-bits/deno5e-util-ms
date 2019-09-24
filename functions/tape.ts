
const overhead_constant = 50n;
const placeholder = null;                    // This isn't that there's no placeholder. The placeholder is null itself.
const placeholder_overhead_constant = 20n;

export default class Tape {

    public  static build: number = 1;
    public  build: number = 1;
    private __length__: bigint;
    private __single_len__: bigint;
    private __available__: bigint;
    public  dict: any;
    private __k_queue__: Array<number|string|null>;
    private __l_queue__: Array<bigint>;
    public  count: bigint;

    constructor(length : bigint, single_item_max_length : bigint|null = null) {

        Tape.__validate_sizes__(length, single_item_max_length);

        this.build = 1;  // version number
        this.__length__ = length;
        this.__single_len__ = single_item_max_length || length;
        this.__available__ = length;
        this.dict = {};
        this.__k_queue__ = [];
        this.__l_queue__ = [];
        this.count = 0n;
    }

    private static __validate_sizes__(length: bigint, single_item_max_length : bigint|null = null): void {

        if (typeof length !== "bigint")
            throw new TypeError("Oi, you must initiate a tape with a bigint length!");

        if (length < 0n)
            throw new Error("Oi, length must be non negative!");

        if (single_item_max_length !== null && (typeof single_item_max_length !== "bigint" || single_item_max_length < 0n))
            throw new Error("Oi, single item max size must be non negative!");

    }

    static estimate_item_size(k: string | number, v: string): bigint {

        const k_length = typeof k === "number" ? 8n : BigInt(k.length);

        return k_length * 2n + BigInt(v.length) + overhead_constant;
    }

    static fromString(string: string): Tape {

        const tp: Tape = JSON.parse(string);

        if (tp.build !== 1)
            throw new Error("this tape utility has version " + Tape.build +
                ", it cannot handle the tape serialization of build " + tp.build + ".");

        const tape = new Tape(tp.__length__);

        tape.build = tp.build;
        tape.__length__ = tp.__length__;
        tape.__available__ = tp.__available__;
        tape.dict = tp.dict;
        tape.__k_queue__ = tp.__k_queue__;
        tape.__l_queue__ = tp.__l_queue__;
        tape.count = tp.count;

        return tape;

    }

    private __drop_excessive__(): void {

        while (this.__available__ < 0 && this.__k_queue__.length > 0) {

            const drop_k = this.__k_queue__.pop();
            const drop_l = this.__l_queue__.pop();

            if (drop_k !== void null && drop_k !== null && drop_l !== void null && drop_l !== null) {


                delete this.dict[drop_k];
                this.__available__ += drop_l;
                this.count -= 1n;
            }
        }

    }

    resize(length: bigint, single_item_max_length: bigint|null = null): void {

        Tape.__validate_sizes__(length, single_item_max_length);

        const original_length = this.__length__;
        const diff = length - original_length;

        this.__length__ = length;
        this.__single_len__ = single_item_max_length || length;
        this.__available__ += diff;

        this.__drop_excessive__();
    }

    record(k: string | number, v: string): void {

        const k_len = typeof k === "number" ? 8n : BigInt(String(k).length)
        const v_len = BigInt(v.length);
        const practical_length = k_len * 2n + v_len + overhead_constant;

        if (practical_length > this.__length__ || practical_length > this.__single_len__)
            return;

        if (k in this.dict) {

            const pos = this.__k_queue__.indexOf(k);
            const original_length = this.__l_queue__[pos];
            const diff = practical_length - original_length;

            this.__l_queue__[pos] = practical_length;
            this.__available__ -= diff;

            this.dict[k] = v;

            this.read(k);  // brings the key into the front
        } else {

            this.__available__ -= practical_length;
            this.count += 1n;

            this.__k_queue__.unshift(k);
            this.__l_queue__.unshift(practical_length);

            this.dict[k] = v;
        }

        this.__drop_excessive__();
    }

    read(key: string | number): any {

        key = String(key);

        if (this.dict[key]) {

            const pos = this.__k_queue__.indexOf(key);

            if (pos !== 0) {

                const k = this.__k_queue__[pos];
                const l = this.__l_queue__[pos];

                this.__k_queue__[pos] = placeholder;
                this.__l_queue__[pos] = placeholder_overhead_constant;

                this.__k_queue__.unshift(k);
                this.__l_queue__.unshift(l);

                this.__available__ -= placeholder_overhead_constant;
            }

            return this.dict[key];
        } else
            return null;
    }

    exist(key: string | number): boolean {

        return key in this.dict;
    }

    erase(key: string | number): boolean {

        key = String(key);

        if (this.dict[key]) {

            const pos = this.__k_queue__.indexOf(key);

            const k = this.__k_queue__[pos];
            const l = this.__l_queue__[pos];

            this.__k_queue__[pos] = placeholder;
            this.__l_queue__[pos] = placeholder_overhead_constant;

            delete this.dict[key];

            this.__available__ += l - placeholder_overhead_constant;

            return true;
        } else {

            return false;
        }
    }

    estimated_length(): bigint {

        return this.__length__ - this.__available__;
    }

    toString(): string {

        return JSON.stringify(this);

    }

}
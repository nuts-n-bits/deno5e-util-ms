import { bigint_to_uint8a, uint8a_to_bigint } from "./encoding/bigint-uint8a"

const hexify = ((x : number) => x > 15 ? x.toString(16) : "0" + x.toString(16))

export class Entropy {

    private one_way_preservation_counter = 0n
    private entropy: Uint8Array

    constructor(
        private foundation_entropy: Uint8Array, 
        starting_entropy: Uint8Array,
        private hash_function: (preimage: Uint8Array) => Uint8Array
    ) {

        this.entropy = starting_entropy
    }

    one_way_preservation_counter_get_and_advance(): Uint8Array {

        const result = bigint_to_uint8a(this.one_way_preservation_counter)
        this.one_way_preservation_counter += 1n
        return result
    }

    contribute(contribution: bigint): this
    contribute(contribution: Uint8Array): this
    contribute(contribution: bigint|Uint8Array): this {

        const formatted_contribution: Uint8Array = typeof contribution === "bigint" ? bigint_to_uint8a(contribution) : contribution
        const preimage = new Uint8Array(this.entropy.length + formatted_contribution.length)
        preimage.set(this.entropy, 0)
        preimage.set(formatted_contribution, this.entropy.length)
        this.entropy = this.hash_function(preimage)

        return this
    }

    produce(): string
    produce(format: "hex" | "b64"): string
    produce(format: "raw"): Uint8Array
    produce(format: "bigint"): bigint
    produce(format?: "hex" | "b64" | "raw" | "bigint") {

        const owpc = this.one_way_preservation_counter_get_and_advance()
        const message_length = this.entropy.length + owpc.length + this.foundation_entropy.length
        const message_to_digest = new Uint8Array(message_length)
        message_to_digest.set(this.entropy, 0)
        message_to_digest.set(owpc, this.entropy.length)
        message_to_digest.set(this.foundation_entropy, this.entropy.length + owpc.length)

        this.entropy = this.hash_function(message_to_digest)

        if(format === "raw")
            return this.entropy
        else if(format === "b64")
            return Buffer.from(this.entropy).toString("base64")
        else if(format === "bigint")
            return uint8a_to_bigint(this.entropy)
        else /* hex */
            return Array.from(this.entropy).map(hexify).join("")
    }

}

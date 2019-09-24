
import { sha256 } from "./functions/crypto/sha256"
import { CatastrophicThousandForLoopRanToCompletionError } from "./protocols/error-warning-info"
import { assert_truthy } from "./protocols/assert-passthrough"
import { Json_store } from "lib-nnbc/json-store"

const hour = 3600 * 1000

export class Entropy {

    private readonly hexify = ((x : number) => x > 15 ? x.toString(16) : "0" + x.toString(16))
    private readonly entropy_json_name = "entropy-sha256sig-c08-array-literal-string"
    private readonly save_entropy_time_interval = 2 * hour
    private          one_way_preservation_counter = [0]
    private          entropy : Uint8Array

    constructor(private foundation_entropy : Uint8Array, private json_store : Json_store) {

        try {
            assert_truthy(json_store.exists_json(this.entropy_json_name))
            this.entropy = new Uint8Array(json_store.get_json(this.entropy_json_name))
            assert_truthy(this.entropy.length === 32)
        }
        catch(e) {
            json_store.set_json(this.entropy_json_name, [9,8,7,6,5,4,3,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9])
            this.entropy = json_store.get_json(this.entropy_json_name)
        }

        this.set_regular_saves()
    }

    save_entropy_sync() {

        this.produce()
        this.json_store.set_json(this.entropy_json_name, Array.from(this.entropy))
    }

    save_entropy_async() {

        this.produce()
        this.json_store.set_json_async(this.entropy_json_name, Array.from(this.entropy))
    }

    set_regular_saves() {
        setInterval(this.save_entropy_async.bind(this), this.save_entropy_time_interval)
        process.on("exit", this.save_entropy_sync.bind(this))
    }

    one_way_preservation_counter_get_c08_and_advance() {

        let byte = 0
    
        for(let i=0; i<1000; i++) {
            this.one_way_preservation_counter[byte] = (this.one_way_preservation_counter[byte]||0) + 1
            if(this.one_way_preservation_counter[byte] < 256) {
                return this.one_way_preservation_counter
            }
            else {
                this.one_way_preservation_counter[byte] = 0
                byte++
            }
        }
        throw ((new CatastrophicThousandForLoopRanToCompletionError()).hard_report())
    }

    contribute(contribution : number) : this
    contribute(contribution : Uint8Array) : this
    contribute(contribution : number|Uint8Array) : this {

        let formatted_contribution : Uint8Array
        if(typeof contribution === "number") {
            formatted_contribution = new Uint8Array([(contribution>>24)&255, (contribution>>16)&255, (contribution>>8)&255, contribution&255])
        }
        else {
            formatted_contribution = contribution
        }
        const preimage = new Uint8Array(this.entropy.length + formatted_contribution.length)
        preimage.set(this.entropy, 0)
        preimage.set(formatted_contribution, this.entropy.length)
        this.entropy = sha256(preimage)

        return this
    }

    produce() : string
    produce(format : "hex" | "b64") : string
    produce(format : "raw") : Uint8Array
    produce(format? : "hex" | "b64" | "raw") {

        const owpc = this.one_way_preservation_counter_get_c08_and_advance()
        const message_length = this.entropy.length + owpc.length + this.foundation_entropy.length
        const message_to_digest = new Uint8Array(message_length)
        message_to_digest.set(this.entropy, 0)
        message_to_digest.set(owpc, this.entropy.length)
        message_to_digest.set(this.foundation_entropy, this.entropy.length + owpc.length)

        this.entropy = sha256(message_to_digest)

        if(format === "raw")
            return new Uint8Array(this.entropy)
        else if(format === "b64")
            return new Buffer(this.entropy).toString("base64")
        else /* hex */
            return Array.from(this.entropy).map(this.hexify).join("")
    }

}


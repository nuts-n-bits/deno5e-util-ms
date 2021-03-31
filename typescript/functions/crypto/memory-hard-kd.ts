import { async_sleep } from "../misc.ts"

// the hash function should have > 32 bits image size
export async function memory_hard_key_derivation(preimage: Uint8Array, hash_function: (x: Uint8Array) => Uint8Array, memory_factor: number, rest_factor: number): Promise<Uint8Array> {

    const memory_hard_image_pool: Array<Uint8Array> = [hash_function(preimage)]
    let phase_2_latest_image: Uint8Array

    for(let i=1; i<memory_factor; i++) {
        memory_hard_image_pool[i] = hash_function(memory_hard_image_pool[i-1]!)
        if(i%rest_factor === 0) { await async_sleep(0) }
    }

    phase_2_latest_image = memory_hard_image_pool[memory_factor-1]!

    for(let i=0; i<memory_factor; i++) {
        const number_derived = (phase_2_latest_image[0]! << 24 | phase_2_latest_image[1]! << 16 | phase_2_latest_image[2]! << 8 | phase_2_latest_image[3]! << 0)>>>0
        const hash_choice = memory_hard_image_pool[number_derived % memory_hard_image_pool.length]!
        phase_2_latest_image = hash_function(ab_concat(hash_choice, phase_2_latest_image))
        if(i%rest_factor === 0) { await async_sleep(0) }
    }

    return memory_hard_image_pool[memory_hard_image_pool.length-1]!
}

function ab_concat (ab1: Uint8Array, ab2: Uint8Array) {  // array buffer concat

    const concat = new Uint8Array(ab1.length + ab2.length)
    concat.set(ab1, 0)
    concat.set(ab2, ab1.length)
    return concat
}
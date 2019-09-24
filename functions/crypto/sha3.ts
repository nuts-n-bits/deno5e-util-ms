import {NotImplementedError} from "../../protocols/error-warning-info"

export function keccak (padded_byte_array : Uint8Array, output_length : bigint) {


    keccak_permutation(new Uint8Array)



}


// each uint8 in the state is 5 bits.
const new_state : Uint8Array = new Uint8Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
])

function _kai (uint8 : number) : number {

    const bit_0 = (uint8 >> 4) & 1
    const bit_1 = (uint8 >> 3) & 1
    const bit_2 = (uint8 >> 2) & 1
    const bit_3 = (uint8 >> 1) & 1
    const bit_4 = (uint8 >> 0) & 1

    const new_bit_0 = bit_0 ^ ((~bit_1) & (bit_2))
    const new_bit_1 = bit_1 ^ ((~bit_2) & (bit_3))
    const new_bit_2 = bit_2 ^ ((~bit_3) & (bit_4))
    const new_bit_3 = bit_3 ^ ((~bit_4) & (bit_0))
    const new_bit_4 = bit_4 ^ ((~bit_0) & (bit_1))

    const A = new_bit_0 << 4
    const B = new_bit_1 << 3
    const C = new_bit_2 << 2
    const D = new_bit_3 << 1
    const E = new_bit_4 << 0

    return A | B | C | D | E
}

function kai (uint8 : number) : number {

    return [0,5,10,11,20,17,22,23,9,12,3,2,13,8,15,14,18,21,24,27,6,1,4,7,26,29,16,19,30,25,28,31][uint8]
}

function keccak_permutation (state : Uint8Array) {


    throw new NotImplementedError(1000)



}
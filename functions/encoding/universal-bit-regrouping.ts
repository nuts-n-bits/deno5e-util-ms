
export default function ubr(from_bit_length : number, to_bit_length : number, from_data_array : ArrayLike<number>) : Uint32Array {

    const total_bit_length = from_bit_length * from_data_array.length
    const remainder = total_bit_length % to_bit_length
    if(remainder != 0)
        throw Error("universal bit regrouping error: data length does not fit after conversion")
    if(from_bit_length < 1 || to_bit_length < 1)
        throw Error("universal bit regrouping error: 0 length cases")

    const length_after_conversion = total_bit_length / to_bit_length
    const to_data_array = Array(length_after_conversion).fill(0)

    let next_focus_begin = 0

    while(next_focus_begin < total_bit_length) {

        const length_to_barrier_from = (from_bit_length - next_focus_begin % from_bit_length) || from_bit_length
        const length_to_barrier_to = (to_bit_length - next_focus_begin % to_bit_length) || to_bit_length
        const transfer_length = length_to_barrier_from > length_to_barrier_to ? length_to_barrier_to : length_to_barrier_from
        const focus_begin = next_focus_begin
        next_focus_begin += transfer_length

        const relevant_from_index = Math.floor(focus_begin / from_bit_length)
        const from_bit_offset     = from_bit_length - focus_begin % from_bit_length - transfer_length
        const relevant_to_index   = Math.floor(focus_begin / to_bit_length)
        const to_bit_offset       = to_bit_length - focus_begin % to_bit_length - transfer_length

        const data_transferred = (((from_data_array[relevant_from_index] >>> from_bit_offset) & ((1 << transfer_length) - 1)) << to_bit_offset)

        if(void "testing purposes: ", 0) {

            console.log("")
            console.log("focus_begin:            " + focus_begin)
            console.log("length_to_barrier_from: " + length_to_barrier_from)
            console.log("length_to_barrier_to:   " + length_to_barrier_to)
            console.log("transfer_length:        " + transfer_length)
            console.log("relevant_from_index:    " + relevant_from_index)
            console.log("from_bit_offset:        " + from_bit_offset)
            console.log("relevant_to_index:      " + relevant_to_index)
            console.log("to_bit_offset:          " + to_bit_offset)
            let dts = (data_transferred).toString(2)
            while(dts.length < transfer_length) dts = "0" + dts
            console.log("data_transferred:       " + dts)
        }

        to_data_array[relevant_to_index] |= data_transferred

    }

    return new Uint32Array(to_data_array)
}

/*

const b64_str_to_int = b64str => [...b64str].map(x => b64map.indexOf(x))
const b32_str_to_int = b32str => [...b32str].map(x => b32map.indexOf(x))
const hex_str_to_int = hexstr => [...hexstr].map(x => hexmap.indexOf(x))

const n8k_str_to_int = n8kstr => n8kstr.split(".").map(x => parseInt(x))
const asc_str_to_int = ascstr => ascstr.split("").map(x => x.charCodeAt(0)%255)

const b64_int_to_str = b64int => b64int.map(x => b64map[x]).join("")
const b32_int_to_str = b32int => b32int.map(x => b32map[x]).join("")
const hex_int_to_str = hexint => hexint.map(x => hexmap[x]).join("")

const n8k_int_to_str = n8kint => n8kint.map(x => x.toString(10)).map(x => "0".repeat(4-x.length) + x).join(".")
*/
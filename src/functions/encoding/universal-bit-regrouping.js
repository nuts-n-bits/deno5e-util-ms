"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ubr = void 0;
function ubr(from_bit_length, to_bit_length, from_data_array) {
    var total_bit_length = from_bit_length * from_data_array.length;
    var remainder = total_bit_length % to_bit_length;
    if (remainder != 0) {
        throw new Error("universal bit regrouping error: data length does not fit after conversion");
    }
    if (from_bit_length < 1 || to_bit_length < 1) {
        throw new Error("universal bit regrouping error: 0 length cases");
    }
    var length_after_conversion = total_bit_length / to_bit_length;
    var to_data_array = Array(length_after_conversion).fill(0);
    var next_focus_begin = 0;
    while (next_focus_begin < total_bit_length) {
        var length_to_barrier_from = (from_bit_length - next_focus_begin % from_bit_length) || from_bit_length;
        var length_to_barrier_to = (to_bit_length - next_focus_begin % to_bit_length) || to_bit_length;
        var transfer_length = length_to_barrier_from > length_to_barrier_to ? length_to_barrier_to : length_to_barrier_from;
        var focus_begin = next_focus_begin;
        next_focus_begin += transfer_length;
        var relevant_from_index = Math.floor(focus_begin / from_bit_length);
        var from_bit_offset = from_bit_length - focus_begin % from_bit_length - transfer_length;
        var relevant_to_index = Math.floor(focus_begin / to_bit_length);
        var to_bit_offset = to_bit_length - focus_begin % to_bit_length - transfer_length;
        var data_transferred = (((from_data_array[relevant_from_index] >>> from_bit_offset) & ((1 << transfer_length) - 1)) << to_bit_offset);
        if (void "testing purposes: ", 0) {
            console.log("");
            console.log("focus_begin:            " + focus_begin);
            console.log("length_to_barrier_from: " + length_to_barrier_from);
            console.log("length_to_barrier_to:   " + length_to_barrier_to);
            console.log("transfer_length:        " + transfer_length);
            console.log("relevant_from_index:    " + relevant_from_index);
            console.log("from_bit_offset:        " + from_bit_offset);
            console.log("relevant_to_index:      " + relevant_to_index);
            console.log("to_bit_offset:          " + to_bit_offset);
            var dts = (data_transferred).toString(2);
            while (dts.length < transfer_length)
                dts = "0" + dts;
            console.log("data_transferred:       " + dts);
        }
        to_data_array[relevant_to_index] |= data_transferred;
    }
    return new Uint32Array(to_data_array);
}
exports.ubr = ubr;
//# sourceMappingURL=universal-bit-regrouping.js.map
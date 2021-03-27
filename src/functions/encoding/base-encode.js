"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uint8array_to_hex = exports.hex_to_uint8array = void 0;
var universal_bit_regrouping_1 = require("./universal-bit-regrouping");
function hex_to_uint8array(hex) {
    return new Uint8Array(universal_bit_regrouping_1.ubr(4, 8, hex.split("").map(function (x) { return parseInt(x, 16); })));
}
exports.hex_to_uint8array = hex_to_uint8array;
function uint8array_to_hex(u8) {
    var hex = "";
    universal_bit_regrouping_1.ubr(8, 4, u8).forEach(function (number) { hex += number.toString(16); });
    return hex;
}
exports.uint8array_to_hex = uint8array_to_hex;
//# sourceMappingURL=base-encode.js.map
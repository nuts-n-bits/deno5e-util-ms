"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.keccak = void 0;
var NotImplementedError = (function (_super) {
    __extends(NotImplementedError, _super);
    function NotImplementedError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NotImplementedError;
}(Error));
function keccak(padded_byte_array, output_length) {
    keccak_permutation(new Uint8Array);
}
exports.keccak = keccak;
var new_state = new Uint8Array([
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
]);
function _kai(uint8) {
    var bit_0 = (uint8 >> 4) & 1;
    var bit_1 = (uint8 >> 3) & 1;
    var bit_2 = (uint8 >> 2) & 1;
    var bit_3 = (uint8 >> 1) & 1;
    var bit_4 = (uint8 >> 0) & 1;
    var new_bit_0 = bit_0 ^ ((~bit_1) & (bit_2));
    var new_bit_1 = bit_1 ^ ((~bit_2) & (bit_3));
    var new_bit_2 = bit_2 ^ ((~bit_3) & (bit_4));
    var new_bit_3 = bit_3 ^ ((~bit_4) & (bit_0));
    var new_bit_4 = bit_4 ^ ((~bit_0) & (bit_1));
    var A = new_bit_0 << 4;
    var B = new_bit_1 << 3;
    var C = new_bit_2 << 2;
    var D = new_bit_3 << 1;
    var E = new_bit_4 << 0;
    return A | B | C | D | E;
}
function kai(uint8) {
    return [0, 5, 10, 11, 20, 17, 22, 23, 9, 12, 3, 2, 13, 8, 15, 14, 18, 21, 24, 27, 6, 1, 4, 7, 26, 29, 16, 19, 30, 25, 28, 31][uint8];
}
function keccak_permutation(state) {
    throw new NotImplementedError();
}
//# sourceMappingURL=sha3.js.map
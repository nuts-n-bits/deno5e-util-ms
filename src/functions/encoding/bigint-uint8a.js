"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uint8a_to_bigint = exports.bigint_to_uint8a = void 0;
function bigint_to_uint8a(int) {
    var a = [];
    while (int !== 0n) {
        a.unshift(int & 255n);
        int = int >> 8n;
    }
    return new Uint8Array(a.map(function (big) { return Number(big); }));
}
exports.bigint_to_uint8a = bigint_to_uint8a;
function uint8a_to_bigint(arr) {
    var int = 0n;
    var shift = (BigInt(arr.length) - 1n) * 8n;
    arr.forEach(function (val, index) {
        int |= BigInt(val) << shift;
        shift -= 8n;
    });
    return int;
}
exports.uint8a_to_bigint = uint8a_to_bigint;
//# sourceMappingURL=bigint-uint8a.js.map
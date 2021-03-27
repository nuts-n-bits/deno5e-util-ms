"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hmac = void 0;
function hmac(hash_function, key, text, hash_function_block_size) {
    if (key.length > hash_function_block_size)
        key = hash_function(key);
    var kip = new Uint8Array(hash_function_block_size).fill(0x36);
    var kop = new Uint8Array(hash_function_block_size).fill(0x5c);
    for (var i = 0; i < key.length; i++) {
        kip[i] ^= key[i];
        kop[i] ^= key[i];
    }
    return hash_function(u8(__spreadArray(__spreadArray([], kop), hash_function(u8(__spreadArray(__spreadArray([], kip), text))))));
}
exports.hmac = hmac;
function u8(array) {
    return new Uint8Array(array);
}
//# sourceMappingURL=hmac.js.map
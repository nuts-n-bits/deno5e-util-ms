"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totp_hmac_sha1 = void 0;
var hmac_1 = require("./hmac");
var sha1_1 = require("./sha1");
function padded_time_byte_array(jst) {
    var i = jst / 1000n / 30n;
    var counter_array = new Uint8Array(8);
    counter_array.set([
        Number((i & (0xffn << 56n)) >> 56n),
        Number((i & (0xffn << 48n)) >> 48n),
        Number((i & (0xffn << 40n)) >> 40n),
        Number((i & (0xffn << 32n)) >> 32n),
        Number((i & (0xffn << 24n)) >> 24n),
        Number((i & (0xffn << 16n)) >> 16n),
        Number((i & (0xffn << 8n)) >> 8n),
        Number((i & (0xffn << 0n)) >> 0n),
    ]);
    return new Uint8Array(counter_array);
}
function group_string(str, num) {
    var arr = [];
    for (var i = 0; i < str.length / num; i++) {
        arr[i] = str.substr(i * num, num);
    }
    return arr;
}
function b32_to_c08(base32) {
    base32 = base32.toUpperCase();
    if (!/^[A-Z2-7]*$/.test(base32))
        throw new Error("illegal character in base32 string");
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    var pad = ["", "AAAAAAAA", "AAAAAA", "AAAAA", "AAAA", "AAA", "AA", "A"];
    base32 += pad[(base32.length % 8)];
    var grouped_string_array = group_string(base32, 8);
    var byte_array = [];
    for (var i = 0; i < grouped_string_array.length; i++) {
        var x = grouped_string_array[i];
        var a = (charset.indexOf(x[0]) << 3 | charset.indexOf(x[1]) >> 2) & 255;
        var b = (charset.indexOf(x[1]) << 6 | charset.indexOf(x[2]) << 1 | charset.indexOf(x[3]) >> 4) & 255;
        var c = (charset.indexOf(x[3]) << 4 | charset.indexOf(x[4]) >> 1) & 255;
        var d = (charset.indexOf(x[4]) << 7 | charset.indexOf(x[5]) << 2 | charset.indexOf(x[6]) >> 3) & 255;
        var e = (charset.indexOf(x[6]) << 5 | charset.indexOf(x[7]) >> 0) & 255;
        byte_array.push(a, b, c, d, e);
    }
    return new Uint8Array(byte_array);
}
function totp_hmac_sha1(base32, jst) {
    var secret_byte_array = b32_to_c08(base32);
    var time_byte_array = padded_time_byte_array(jst);
    var otp = hmac_1.hmac(sha1_1.sha1, secret_byte_array, time_byte_array, sha1_1.block_size_sha1);
    var offset = otp[otp.length - 1] & 15;
    var a = otp[offset] & 127;
    var b = otp[offset + 1];
    var c = otp[offset + 2];
    var d = otp[offset + 3];
    var result = a << 24 | b << 16 | c << 8 | d;
    return result % 1e6;
}
exports.totp_hmac_sha1 = totp_hmac_sha1;
//# sourceMappingURL=totp-hmac.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escape = exports.unescape = void 0;
function unescape(escaped_string) {
    var new_string = "";
    for (var i = 0; i < escaped_string.length; i++) {
        if (escaped_string[i] !== "%") {
            new_string += escaped_string[i];
        }
        else {
            new_string += String.fromCharCode(parseInt(escaped_string.substr(i + 1, 2), 16));
            i += 2;
        }
    }
    return new_string;
}
exports.unescape = unescape;
function fill_zeros(str, fill_to) {
    var fill_this_many = fill_to - str.length;
    if (fill_this_many <= 0)
        return str;
    return "0".repeat(fill_this_many) + str;
}
function escape(unescaped_string) {
    var new_string = "";
    for (var i = 0; i < unescaped_string.length; i++) {
        var code = unescaped_string.charCodeAt(i);
        if (code >= 97 && code <= 122 || code >= 64 && code <= 90 || code >= 45 && code <= 57 || code === 42 || code === 43 || code === 95)
            new_string += unescaped_string[i];
        else if (code <= 255)
            new_string += "%" + fill_zeros(unescaped_string.charCodeAt(i).toString(16).toUpperCase(), 2);
        else
            new_string += "%" + fill_zeros(unescaped_string.charCodeAt(i).toString(16).toUpperCase(), 4);
    }
    return new_string;
}
exports.escape = escape;
if (0) {
    "this is a test for the unescape polyfill";
    var arr = [];
    for (var i = 0; i < 10000; i++)
        arr[i] = i;
    arr = arr.map(function (x) { return String.fromCodePoint(x); });
    var brr = arr.map(function (x) { return escape(x); });
    for (var i = 0; i < 10000; i++) {
        if (arr[i] === brr[i])
            console.log(i + ": ♥️ (" + arr[i] + ")");
        else
            console.log(i + ": 🍰 (" + arr[i] + ", " + brr[i] + ")");
    }
}
//# sourceMappingURL=unescape.js.map